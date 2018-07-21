// IPlayerAidlInterfaceCallback.aidl
package com.welaaav2.player.service;

// Declare any non-default types here with import statements

interface IPlayerAidlInterfaceCallback {
    void onError();
    void onPrepared();
    void onCompletion();
    void onUpdate(int position);
    void onPrev();
    void onNext();
}
