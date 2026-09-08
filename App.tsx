import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
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

  if (published) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.logo}>MeeNyo</Text>
        <Text style={styles.mm}>Shot Story တင်ပြီးပါပြီ</Text>
        <Text style={styles.tagline}>သင့်ရဲ့အမှတ်တရကို MeeNyo မှာ သိမ်းထားလိုက်ပါပြီ။</Text>
        <Pressable
          style={styles.button}
          onPress={() => {
            setPublished(false);
            setStoryMode(false);
            setStoryText('');
            setPhoto(null);
          }}
        >
          <Text style={styles.buttonText}>📷 နောက်ထပ် Story ရိုက်မည်</Text>
        </Pressable>
      </View>
    );
  }

  if (photo && storyMode) {
    return (
      <View style={styles.storyContainer}>
        <StatusBar style="light" />
        <Image source={{ uri: photo }} style={styles.absoluteFill} />
        <View style={styles.storyShade} />

        <View style={styles.storyHeader}>
          <Text style={styles.storyHeaderTitle}>Shot Story</Text>
          <Text style={styles.storyHeaderSub}>ဒီအချိန်လေးကို စာတစ်ကြောင်းနဲ့ မှတ်တမ်းတင်ပါ</Text>
        </View>

        <View style={styles.storyCard}>
          <TextInput
            value={storyText}
            onChangeText={setStoryText}
            placeholder="ဒီနေ့ရဲ့ အမှတ်တရလေး..."
            placeholderTextColor="#999"
            multiline
            maxLength={180}
            style={styles.storyInput}
          />
          <Text style={styles.counter}>{storyText.length}/180</Text>

          <View style={styles.storyActions}>
            <Pressable style={styles.cancelStory} onPress={() => setStoryMode(false)}>
              <Text style={styles.cancelText}>ပြန်ကြည့်မည်</Text>
            </Pressable>
            <Pressable
              style={[styles.publishButton, !storyText.trim() && styles.publishDisabled]}
              disabled={!storyText.trim()}
              onPress={() => setPublished(true)}
            >
              <Text style={styles.publishText}>တင်မည် ✨</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar style="light" />
        <Image source={{ uri: photo }} style={styles.absoluteFill} />
        <View style={styles.previewShade} />

        <View style={styles.previewTop}>
          <Text style={styles.logo}>MeeNyo</Text>
          <Text style={styles.mm}>မီးညို</Text>
          <Text style={styles.previewHint}>အမှတ်တရလေး အဆင်သင့်ဖြစ်ပါပြီ</Text>
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
      Alert.alert('MeeNyo', 'ဓာတ်ပုံရိုက်ရာတွင် အခက်အခဲရှိပါသည်။');
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <StatusBar style="light" />
      <CameraView
        ref={cameraRef}
        style={styles.absoluteFill}
        facing={facing}
        mode="picture"
      />
      <View style={styles.overlay} />

      <View style={styles.logoBox}>
        <Text style={styles.logo}>MeeNyo</Text>
        <Text style={styles.mm}>မီးညို</Text>
        <Text style={styles.tagline}>ချစ်စရာကမ္ဘာလေးထဲက ကိုယ်ပိုင်အချိန်</Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={styles.smallButton}
          onPress={() => setFacing(current => current === 'back' ? 'front' : 'back')}
        >
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
  storyContainer: { flex: 1, backgroundColor: '#1a1a2e' },
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  previewShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.28)' },
  storyShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.48)' },
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
  previewHint: { color: '#fff', fontSize: 14, marginTop: 12, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18 },
  previewBottom: { position: 'absolute', bottom: 45, width: '100%', alignItems: 'center', gap: 14 },
  retake: { backgroundColor: 'rgba(0,0,0,0.65)', paddingVertical: 13, paddingHorizontal: 28, borderRadius: 25 },
  retakeText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  post: { backgroundColor: '#f9a826', paddingVertical: 17, paddingHorizontal: 42, borderRadius: 28, elevation: 5 },
  postText: { color: '#000', fontSize: 16, fontWeight: '800' },
  storyHeader: { position: 'absolute', top: 58, left: 24, right: 24, alignItems: 'center' },
  storyHeaderTitle: { color: '#f9a826', fontSize: 32, fontWeight: '900' },
  storyHeaderSub: { color: '#fff', fontSize: 13, marginTop: 8, textAlign: 'center' },
  storyCard: { position: 'absolute', left: 18, right: 18, bottom: 28, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 24, padding: 18 },
  storyInput: { minHeight: 100, maxHeight: 150, color: '#151525', fontSize: 17, lineHeight: 25, textAlignVertical: 'top', padding: 4 },
  counter: { textAlign: 'right', color: '#888', fontSize: 12, marginTop: 4 },
  storyActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  cancelStory: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  cancelText: { color: '#333', fontWeight: '700' },
  publishButton: { flex: 1, backgroundColor: '#f9a826', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  publishDisabled: { opacity: 0.45 },
  publishText: { color: '#000', fontWeight: '900' },
  successIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#f9a826', color: '#000', fontSize: 48, fontWeight: '900', textAlign: 'center', lineHeight: 76, marginBottom: 18 },
});
