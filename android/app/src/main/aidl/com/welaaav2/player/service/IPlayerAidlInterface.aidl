// IPlayerAidlInterface.aidl
package com.welaaav2.player.service;

// Declare any non-default types here with import statements
import com.welaaav2.player.service.IPlayerAidlInterfaceCallback;

interface IPlayerAidlInterface {
    void play();
    void pause();
    void seekTo(int position);
    boolean isPlaying();
    boolean registerCallback(IPlayerAidlInterfaceCallback callback);
    boolean unregisterCallback(IPlayerAidlInterfaceCallback callback);
}
