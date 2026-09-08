import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [photo, setPhoto] = useState<string | null>(null);
  const [storyMode, setStoryMode] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [published, setPublished] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.logo}>MeeNyo</Text>
        <Text style={styles.mm}>မီးညို</Text>
        <ActivityIndicator color="#f9a826" size="large" style={styles.loader} />
        <Text style={styles.tagline}>Camera ကို စတင်ပြင်ဆင်နေသည်…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.logo}>MeeNyo</Text>
        <Text style={styles.mm}>မီးညို</Text>
        <Text style={styles.tagline}>ချစ်စရာကမ္ဘာလေးထဲက ကိုယ်ပိုင်အချိန်</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>📷 Camera ဖွင့်မည်</Text>
        </Pressable>
      </View>
    );
  }

  if (published && photo) {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar style="light" />
        <Image source={{ uri: photo }} style={styles.absoluteFill} />
        <View style={styles.publishedOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Story တင်ပြီးပါပြီ</Text>
            <Text style={styles.successText}>သင့်ရဲ့ Short Story ကို MeeNyo မှာ သိမ်းထားပါပြီ။</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                setPublished(false);
                setStoryMode(false);
                setStoryText('');
                setPhoto(null);
              }}
            >
              <Text style={styles.buttonText}>Camera ပြန်ဖွင့်မည်</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (storyMode && photo) {
    return (
      <KeyboardAvoidingView
        style={styles.editorContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.editorContent} keyboardShouldPersistTaps="handled">
          <View style={styles.editorHeader}>
            <Pressable onPress={() => setStoryMode(false)} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>‹ ပြန်</Text>
            </Pressable>
            <Text style={styles.editorTitle}>Short Story</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.storyImageWrap}>
            <Image source={{ uri: photo }} style={styles.storyImage} />
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>📷 MeeNyo</Text>
            </View>
          </View>

          <Text style={styles.editorLabel}>ဒီအချိန်လေးကို ဘာပြောချင်လဲ?</Text>
          <TextInput
            value={storyText}
            onChangeText={setStoryText}
            placeholder="ကိုယ့်ရဲ့ Short Story လေးရေးပါ…"
            placeholderTextColor="#888"
            multiline
            maxLength={500}
            style={styles.storyInput}
            textAlignVertical="top"
          />
          <Text style={styles.counter}>{storyText.length}/500</Text>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>💡 Short Story</Text>
            <Text style={styles.tipText}>ပုံလေးနဲ့အတူ ကိုယ့်ရဲ့ အမှတ်တရ၊ ခံစားချက် ဒါမှမဟုတ် ဒီနေ့အကြောင်းလေး မျှဝေပါ။</Text>
          </View>

          <Pressable
            style={[styles.publishButton, !storyText.trim() && styles.publishDisabled]}
            disabled={!storyText.trim()}
            onPress={() => setPublished(true)}
          >
            <Text style={styles.publishButtonText}>✨ Story တင်မည်</Text>
          </Pressable>

          <Text style={styles.privacy}>🔒 Privacy First • MeeNyo</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (photo) {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar style="light" />
        <Image source={{ uri: photo }} style={styles.absoluteFill} />
        <View style={styles.previewTop}>
          <Text style={styles.logo}>MeeNyo</Text>
          <Text style={styles.mm}>မီးညို</Text>
        </View>
        <View style={styles.previewBottom}>
          <Pressable style={styles.retake} onPress={() => setPhoto(null)}>
            <Text style={styles.retakeText}>↩ ပြန်ရိုက်မည်</Text>
          </Pressable>
          <Pressable style={styles.post} onPress={() => setStoryMode(true)}>
            <Text style={styles.postText}>Shot Story တင်မည်</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;
      const result = await cameraRef.current.takePictureAsync();
      if (result?.uri) setPhoto(result.uri);
    } catch (error) {
      console.log('Camera error:', error);
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <StatusBar style="light" />
      <CameraView ref={cameraRef} style={styles.absoluteFill} facing={facing} mode="picture" />
      <View style={styles.overlay} />
      <View style={styles.logoBox}>
        <Text style={styles.logo}>MeeNyo</Text>
        <Text style={styles.mm}>မီးညို</Text>
        <Text style={styles.tagline}>ချစ်စရာကမ္ဘာလေးထဲက ကိုယ်ပိုင်အချိန်</Text>
      </View>
      <View style={styles.bottom}>
        <Pressable style={styles.smallButton} onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}>
          <Text style={styles.smallText}>↻</Text>
        </Pressable>
        <Pressable style={styles.capture} onPress={takePhoto}>
          <View style={styles.captureInner} />
        </Pressable>
        <Pressable style={styles.smallButton}>
          <Text style={styles.smallText}>♡</Text>
        </Pressable>
      </View>
      <Text style={styles.footer}>Privacy First • MeeNyo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', alignItems: 'center', justifyContent: 'center', padding: 24 },
  cameraContainer: { flex: 1, backgroundColor: '#1a1a2e' },
  editorContainer: { flex: 1, backgroundColor: '#12121f' },
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  logoBox: { position: 'absolute', top: 65, width: '100%', alignItems: 'center' },
  logo: { color: '#f9a826', fontSize: 46, fontWeight: '800' },
  mm: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 4 },
  tagline: { color: '#ddd', fontSize: 14, marginTop: 12, textAlign: 'center' },
  loader: { marginTop: 28 },
  button: { backgroundColor: '#f9a826', paddingVertical: 16, paddingHorizontal: 35, borderRadius: 30, marginTop: 35 },
  buttonText: { color: '#000', fontSize: 17, fontWeight: '700' },
  bottom: { position: 'absolute', bottom: 65, left: 30, right: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  capture: { width: 78, height: 78, borderRadius: 39, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#f9a826' },
  smallButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' },
  smallText: { color: '#fff', fontSize: 28 },
  footer: { position: 'absolute', bottom: 20, alignSelf: 'center', color: '#ddd', fontSize: 12 },
  previewTop: { position: 'absolute', top: 55, width: '100%', alignItems: 'center' },
  previewBottom: { position: 'absolute', bottom: 45, width: '100%', alignItems: 'center', gap: 14 },
  retake: { backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 13, paddingHorizontal: 28, borderRadius: 25 },
  retakeText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  post: { backgroundColor: '#f9a826', paddingVertical: 16, paddingHorizontal: 35, borderRadius: 28 },
  postText: { color: '#000', fontSize: 16, fontWeight: '700' },
  editorContent: { padding: 20, paddingBottom: 45 },
  editorHeader: { height: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editorTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerButton: { paddingVertical: 10, paddingRight: 20 },
  headerButtonText: { color: '#f9a826', fontSize: 17, fontWeight: '700' },
  headerSpacer: { width: 55 },
  storyImageWrap: { height: 330, borderRadius: 22, overflow: 'hidden', backgroundColor: '#22223a', marginTop: 8 },
  storyImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageBadge: { position: 'absolute', left: 14, bottom: 14, backgroundColor: 'rgba(0,0,0,0.55)', paddingVertical: 7, paddingHorizontal: 12, borderRadius: 16 },
  imageBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  editorLabel: { color: '#fff', fontSize: 17, fontWeight: '700', marginTop: 22, marginBottom: 10 },
  storyInput: { minHeight: 130, borderWidth: 1, borderColor: '#3b3b52', borderRadius: 18, backgroundColor: '#1d1d30', color: '#fff', padding: 16, fontSize: 16, lineHeight: 24 },
  counter: { color: '#777', textAlign: 'right', marginTop: 6, fontSize: 12 },
  tipCard: { backgroundColor: '#202033', borderRadius: 16, padding: 15, marginTop: 18 },
  tipTitle: { color: '#f9a826', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  tipText: { color: '#bbb', fontSize: 13, lineHeight: 20 },
  publishButton: { backgroundColor: '#f9a826', borderRadius: 28, paddingVertical: 17, alignItems: 'center', marginTop: 22 },
  publishDisabled: { opacity: 0.45 },
  publishButtonText: { color: '#000', fontSize: 17, fontWeight: '800' },
  privacy: { color: '#777', textAlign: 'center', marginTop: 18, fontSize: 12 },
  publishedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.58)', alignItems: 'center', justifyContent: 'center', padding: 25 },
  successCard: { width: '100%', backgroundColor: '#1d1d30', borderRadius: 24, padding: 25, alignItems: 'center' },
  successIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#f9a826', color: '#000', fontSize: 36, fontWeight: '800', textAlign: 'center', lineHeight: 58 },
  successTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 16 },
  successText: { color: '#bbb', fontSize: 14, textAlign: 'center', lineHeight: 21, marginTop: 9 },
});