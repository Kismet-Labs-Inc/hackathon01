import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { BackButton } from "@/components/ui/BackButton";
import { useMenuStore } from "@/stores/useMenuStore";
import { parseMenuPhoto, toggleForceFallback } from "@/services/menuParser";
import { GEMINI_API_KEY } from "@/constants/apiKeys";
import { colors, spacing, borderRadius } from "@/theme/tokens";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const FRAME_PADDING = 40;
const FRAME_WIDTH = SCREEN_WIDTH - FRAME_PADDING * 2;
const FRAME_HEIGHT = SCREEN_HEIGHT * 0.5;

type ScreenState = "camera" | "preview" | "processing" | "success";

interface PhotoData {
  uri: string;
  base64: string | null;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [screenState, setScreenState] = useState<ScreenState>("camera");
  const [photo, setPhoto] = useState<PhotoData | null>(null);
  const store = useMenuStore();

  // Reset state when screen comes back into focus (e.g., from "Scan another menu")
  useFocusEffect(
    useCallback(() => {
      setScreenState("camera");
      setPhoto(null);
    }, [])
  );

  // Dev toggle: triple-tap tracking
  const tapTimestamps = useRef<number[]>([]);
  const [devMessage, setDevMessage] = useState<string | null>(null);

  // Scan line animation
  const scanLineY = useSharedValue(0);

  // Scanning text pulse
  const scanTextOpacity = useSharedValue(1);

  // Count-up animation
  const countValue = useSharedValue(0);

  const handleDevTap = useCallback(() => {
    const now = Date.now();
    tapTimestamps.current.push(now);
    // Keep only taps within last 1 second
    tapTimestamps.current = tapTimestamps.current.filter(
      (t) => now - t < 1000
    );
    if (tapTimestamps.current.length >= 3) {
      tapTimestamps.current = [];
      toggleForceFallback();
      setDevMessage("Dev: Fallback mode toggled");
      setTimeout(() => setDevMessage(null), 1500);
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as ImagePicker.MediaType,
      quality: 0.6,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto({
        uri: result.assets[0].uri,
        base64: result.assets[0].base64 ?? null,
      });
      setScreenState("preview");
    }
  }, []);

  const capturePhoto = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      if (result) {
        setPhoto({ uri: result.uri, base64: result.base64 ?? null });
        setScreenState("preview");
      }
    } catch (err) {
      console.warn("[scan] capture failed:", err);
    }
  }, []);

  const handleRetake = useCallback(() => {
    setPhoto(null);
    setScreenState("camera");
  }, []);

  const handleUseThis = useCallback(async () => {
    if (!photo) return;
    setScreenState("processing");
    store.setProcessing(true);

    try {
      if (!photo.base64) return;
      const items = await parseMenuPhoto(photo.base64, GEMINI_API_KEY);
      store.setItems(items);
      setScreenState("success");
    } catch (err) {
      console.warn("[scan] parse error:", err);
      store.setError(
        err instanceof Error ? err.message : "Unknown error"
      );
      setScreenState("success");
    }
  }, [photo, store]);

  // Start scan line animation when processing
  useEffect(() => {
    if (screenState === "processing") {
      scanLineY.value = 0;
      scanLineY.value = withRepeat(
        withTiming(SCREEN_HEIGHT, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1,
        true
      );
      scanTextOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 500 }),
          withTiming(1.0, { duration: 500 })
        ),
        -1,
        false
      );
    }
  }, [screenState, scanLineY, scanTextOpacity]);

  // Count-up and auto-advance on success
  useEffect(() => {
    if (screenState === "success") {
      const target = store.items.length;
      countValue.value = 0;
      countValue.value = withTiming(target, { duration: 1000 });

      const timeout = setTimeout(() => {
        router.replace("/mood");
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [screenState, store.items.length, countValue, router]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const scanTextStyle = useAnimatedStyle(() => ({
    opacity: scanTextOpacity.value,
  }));

  const countUpProps = useAnimatedProps(() => ({
    text: String(Math.round(countValue.value)),
    defaultValue: "0",
  }));

  // --- Permission not yet loaded ---
  if (!permission) {
    return <View style={styles.container} />;
  }

  // --- Permission not granted ---
  if (!permission.granted && screenState === "camera") {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionHeading}>Camera Access</Text>
          <Text style={styles.permissionBody}>
            We need camera access to scan menus
          </Text>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [
              styles.permissionButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.permissionButtonText}>Allow Camera</Text>
          </Pressable>
          <Pressable onPress={pickFromGallery}>
            <Text style={styles.galleryLink}>Use Gallery Instead</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --- Camera state ---
  if (screenState === "camera") {
    return (
      <View style={styles.container}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
        />

        {/* Framing guide overlay */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {/* Top overlay */}
          <View style={styles.overlayTop} />
          {/* Middle row */}
          <View style={styles.overlayMiddleRow}>
            <View style={styles.overlaySide} />
            <View style={styles.frameCutout} />
            <View style={styles.overlaySide} />
          </View>
          {/* Bottom overlay */}
          <View style={styles.overlayBottom} />
        </View>

        {/* Hint text */}
        <View style={styles.hintContainer} pointerEvents="none">
          <Text style={styles.hintText}>
            Position the menu within the frame
          </Text>
        </View>

        {/* Back button with dev toggle */}
        <Pressable
          onPress={handleDevTap}
          style={styles.devTapArea}
        >
          <BackButton />
        </Pressable>

        {/* Dev message */}
        {devMessage && (
          <View style={styles.devMessageContainer}>
            <Text style={styles.devMessageText}>{devMessage}</Text>
          </View>
        )}


        {/* Bottom controls */}
        <View style={styles.cameraControls}>
          {/* Gallery button */}
          <Pressable onPress={pickFromGallery} style={styles.galleryButton}>
            <Text style={styles.galleryButtonText}>Gallery</Text>
          </Pressable>

          {/* Capture button */}
          <Pressable
            onPress={capturePhoto}
            style={({ pressed }) => [
              styles.captureOuter,
              pressed && styles.captureButtonPressed,
            ]}
          >
            <View style={styles.captureButton} />
          </Pressable>

          {/* Spacer for symmetry */}
          <View style={styles.galleryButton} />
        </View>
      </View>
    );
  }

  // --- Preview state ---
  if (screenState === "preview") {
    return (
      <View style={styles.container}>
        {photo && (
          <Image
            source={{ uri: photo.uri }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        )}
        <View style={styles.previewButtons}>
          <Pressable
            onPress={handleRetake}
            style={({ pressed }) => [
              styles.retakeButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.retakeButtonText}>Retake</Text>
          </Pressable>
          <Pressable
            onPress={handleUseThis}
            style={({ pressed }) => [
              styles.useThisButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.useThisButtonText}>Use This</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // --- Processing state ---
  if (screenState === "processing") {
    return (
      <View style={styles.container}>
        {photo && (
          <Image
            source={{ uri: photo.uri }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        )}
        <View style={styles.processingOverlay} />
        <Animated.View style={[styles.scanLine, scanLineStyle]} />
        <View style={styles.processingTextContainer}>
          <Animated.Text style={[styles.processingText, scanTextStyle]}>
            Scanning menu...
          </Animated.Text>
        </View>
      </View>
    );
  }

  // --- Success state ---
  return (
    <View style={styles.container}>
      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}
      <View style={styles.processingOverlay} />
      <View style={styles.successContent}>
        <AnimatedTextInput
          editable={false}
          animatedProps={countUpProps}
          style={styles.countNumber}
        />
        <Text style={styles.countLabel}>dishes found!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Permission screen
  permissionContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  permissionHeading: {
    color: colors.white,
    fontSize: 28,
    fontFamily: "PlusJakartaSans_700Bold",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  permissionBody: {
    color: colors.gray,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  permissionButton: {
    backgroundColor: colors.coral,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md,
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  permissionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  galleryLink: {
    color: colors.coral,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  // Framing guide overlay
  overlayTop: {
    height: (SCREEN_HEIGHT - FRAME_HEIGHT) / 2 - 40,
    backgroundColor: "rgba(10, 10, 10, 0.6)",
  },
  overlayMiddleRow: {
    flexDirection: "row",
    height: FRAME_HEIGHT,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 10, 0.6)",
  },
  frameCutout: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: borderRadius.lg,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: "rgba(10, 10, 10, 0.6)",
  },

  // Hint text
  hintContainer: {
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.18,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    color: colors.gray,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  // Dev toggle
  devTapArea: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  },
  devMessageContainer: {
    position: "absolute",
    top: 110,
    left: spacing.lg,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    zIndex: 20,
  },
  devMessageText: {
    color: colors.coral,
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
  },

  // Camera controls
  cameraControls: {
    position: "absolute",
    bottom: 60,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 50,
  },
  galleryButton: {
    width: 60,
    alignItems: "center",
  },
  galleryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  captureOuter: {
    width: 78,
    height: 78,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    borderColor: "rgba(232, 116, 74, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.full,
    backgroundColor: colors.coral,
  },
  captureButtonPressed: {
    transform: [{ scale: 0.9 }],
  },

  // Preview buttons
  previewButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: 60,
    paddingTop: spacing.xl,
    backgroundColor: "rgba(10, 10, 10, 0.85)",
  },
  retakeButton: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.coral,
    backgroundColor: "transparent",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
  },
  retakeButtonText: {
    color: colors.coral,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  useThisButton: {
    borderRadius: borderRadius.full,
    backgroundColor: colors.coral,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
  },
  useThisButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
  },

  // Shared
  buttonPressed: {
    opacity: 0.7,
  },

  // Processing
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 10, 0.7)",
  },
  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.coral,
    opacity: 0.8,
  },
  processingTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  // Success
  successContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  countNumber: {
    color: colors.white,
    fontSize: 48,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    textAlign: "center",
    padding: 0,
  },
  countLabel: {
    color: colors.coral,
    fontSize: 20,
    fontFamily: "PlusJakartaSans_600SemiBold",
    marginTop: spacing.sm,
  },
});
