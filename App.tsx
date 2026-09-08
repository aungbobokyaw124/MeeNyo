import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [photo, setPhoto] = useState<string | null>(null);
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
        <Text style={styles.tagline}>
          ချစ်စရာကမ္ဘာလေးထဲက ကိုယ်ပိုင်အချိန်
        </Text>

        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>📷 Camera ဖွင့်မည်</Text>
        </Pressable>
      </View>
    );
  }

  if (photo) {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar style="light" />

        <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} />

        <View style={styles.previewTop}>
          <Text style={styles.logo}>MeeNyo</Text>
          <Text style={styles.mm}>မီးညို</Text>
        </View>

        <View style={styles.previewBottom}>
          <Pressable
            style={styles.retake}
            onPress={() => setPhoto(null)}
          >
            <Text style={styles.retakeText}>↩ ပြန်ရိုက်မည်</Text>
          </Pressable>

          <Pressable style={styles.post}>
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

      if (result?.uri) {
        setPhoto(result.uri);
      }
    } catch (error) {
      console.log('Camera error:', error);
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <StatusBar style="light" />

      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode="picture"
      />

      <View style={styles.overlay} />

      <View style={styles.logoBox}>
        <Text style={styles.logo}>MeeNyo</Text>
        <Text style={styles.mm}>မီးညို</Text>
        <Text style={styles.tagline}>
          ချစ်စရာကမ္ဘာလေးထဲက ကိုယ်ပိုင်အချိန်
        </Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          style={styles.smallButton}
          onPress={() =>
            setFacing(current =>
              current === 'back' ? 'front' : 'back'
            )
          }
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
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  cameraContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  logoBox: {
    position: 'absolute',
    top: 65,
    width: '100%',
    alignItems: 'center',
  },

  logo: {
    color: '#f9a826',
    fontSize: 46,
    fontWeight: '800',
  },

  mm: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },

  tagline: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },

  loader: {
    marginTop: 28,
  },

  button: {
    backgroundColor: '#f9a826',
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 30,
    marginTop: 35,
  },

  buttonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
  },

  bottom: {
    position: 'absolute',
    bottom: 65,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  capture: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f9a826',
  },

  smallButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallText: {
    color: '#fff',
    fontSize: 28,
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    color: '#ddd',
    fontSize: 12,
  },

  previewTop: {
    position: 'absolute',
    top: 55,
    width: '100%',
    alignItems: 'center',
  },

  previewBottom: {
    position: 'absolute',
    bottom: 45,
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },

  retake: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 25,
  },

  retakeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  post: {
    backgroundColor: '#f9a826',
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 28,
  },

  postText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
