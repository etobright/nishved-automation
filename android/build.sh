#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
: "${ANDROID_PLATFORM_JAR:?Provide the path to Android 35 android.jar}"
: "${ANDROID_BUILD_TOOLS:?Provide the path to Android Build Tools 35.0.0}"
: "${ECJ_JAR:?Provide the path to ecj-3.40.0.jar}"
: "${CAP_ANDROID_KEYSTORE:?Provide the path to the Android signing keystore}"
: "${CAP_ANDROID_KEY_ALIAS:?Provide the key alias}"
: "${CAP_ANDROID_STORE_PASS:?Provide the keystore password via the environment}"
export CAP_ANDROID_STORE_PASS

output="${1:-public/cap-digital-scolaire.apk}"
mkdir -p "$(dirname "$output")"
build=$(mktemp -d)
trap 'rm -rf "$build"' EXIT
mkdir -p "$build/classes" "$build/dex" "$build/assets/web"

npm run build
cp -R dist/. "$build/assets/web/"
rm -f "$build/assets/web/cap-digital-scolaire.apk"

java -jar "$ECJ_JAR" -8 -proc:none -bootclasspath "$ANDROID_PLATFORM_JAR:$ANDROID_BUILD_TOOLS/core-lambda-stubs.jar" \
    -d "$build/classes" android/src/scolaire/capdigital/MainActivity.java
jar_classes="$build/classes.zip"
(cd "$build/classes" && zip -qr "$jar_classes" .)
"$ANDROID_BUILD_TOOLS/d8" --min-api 23 --lib "$ANDROID_PLATFORM_JAR" \
    --output "$build/dex" "$jar_classes"
"$ANDROID_BUILD_TOOLS/aapt2" compile --dir android/res -o "$build/resources.zip"
"$ANDROID_BUILD_TOOLS/aapt2" link -I "$ANDROID_PLATFORM_JAR" \
    --manifest android/AndroidManifest.xml -A "$build/assets" \
    -o "$build/unsigned.apk" "$build/resources.zip"
(cd "$build/dex" && zip -q "$build/unsigned.apk" classes.dex)
"$ANDROID_BUILD_TOOLS/zipalign" -f 4 "$build/unsigned.apk" "$build/aligned.apk"
"$ANDROID_BUILD_TOOLS/apksigner" sign --ks "$CAP_ANDROID_KEYSTORE" \
    --ks-key-alias "$CAP_ANDROID_KEY_ALIAS" --ks-pass env:CAP_ANDROID_STORE_PASS \
    --out "$build/signed.apk" "$build/aligned.apk"
"$ANDROID_BUILD_TOOLS/apksigner" verify --verbose "$build/signed.apk"
install -m 644 "$build/signed.apk" "$output"
