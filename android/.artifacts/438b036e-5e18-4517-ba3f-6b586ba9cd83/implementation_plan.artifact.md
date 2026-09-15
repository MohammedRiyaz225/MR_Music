# Configure Signed Release APK

This plan will guide you through creating a keystore and configuring your project to generate a signed Release APK (or AAB) automatically using Gradle. This avoids having to use the "Generate Signed Bundle / APK" wizard every time.

## User Review Required

> [!IMPORTANT]
> You will need to choose a **keystore password**, a **key alias**, and a **key password**. Keep these secure and do not share them.
> We will store these in a `key.properties` file which should **not** be committed to version control.

## Proposed Changes

### Project Configuration

#### [NEW] [key.properties](file:///C:/Users/princ/OneDrive/Desktop/mr-music---romantic-love-mode%20(2)/android/key.properties)
Create a property file to store keystore paths and credentials securely.

#### [MODIFY] [.gitignore](file:///C:/Users/princ/OneDrive/Desktop/mr-music---romantic-love-mode%20(2)/android/.gitignore)
Add `key.properties` and `*.jks` to `.gitignore` to prevent accidental leaks.

#### [MODIFY] [app/build.gradle](file:///C:/Users/princ/OneDrive/Desktop/mr-music---romantic-love-mode%20(2)/android/app/build.gradle)
Configure the `signingConfigs` and `buildTypes` to use the credentials from `key.properties`.

## Verification Plan

### Manual Verification
1. **Generate Keystore**: I will provide a command to generate the keystore file.
2. **Build Release APK**: Run `./gradlew :app:assembleRelease` to verify that the signed APK is generated successfully.
3. **Check Output**: Verify the APK is generated at `app/build/outputs/apk/release/app-release.apk`.
