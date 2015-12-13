package com.reactnativekeychain;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.content.SharedPreferences;

public class KeychainModule extends ReactContextBaseJavaModule {
  private SharedPreferences _preferences;

  public KeychainModule(ReactApplicationContext reactContext) {
    super(reactContext);

    this._preferences = reactContext.getSharedPreferences(reactContext.getPackageName() + ".SecureStorage", 0);
  }

  @Override
  public String getName() {
    return "RNKeychainManager";
  }

  @ReactMethod
  public void protect(String key, String value) {
    SharedPreferences.Editor editor = this._preferences.edit();
    editor.putString(key, value);
    editor.commit();
  }

  @ReactMethod
  public void unprotect(String key, Callback successCallback) {
    try
    {
      String data = this._preferences.getString(key, null);

      successCallback.invoke(data);
    }
    catch(Exception e)
    {

    }
  }

  @ReactMethod
  public void remove(String key) {
    if (this._preferences.contains(key)) {
      SharedPreferences.Editor editor = this._preferences.edit();
      editor.remove(key);
      editor.commit();
    }
  }
}
