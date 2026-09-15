package com.mrmusic.player.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Binder
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.mrmusic.player.MainActivity
import com.mrmusic.player.R
import com.mrmusic.player.model.Track

/**
 * Foreground Audio Service in Kotlin handling background audio playback & notifications.
 */
class MRMusicAudioService : Service() {

    private val binder = LocalBinder()
    private var currentTrack: Track? = null
    private var isPlaying: Boolean = false

    inner class LocalBinder : Binder() {
        fun getService(): MRMusicAudioService = this@MRMusicAudioService
    }

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        when (action) {
            ACTION_PLAY -> resumePlayback()
            ACTION_PAUSE -> pausePlayback()
            ACTION_STOP -> stopForegroundPlayback()
        }
        return START_NOT_STICKY
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "MR Music Playback",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "MR Music background audio notification"
                setShowBadge(false)
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    fun startForegroundWithTrack(track: Track) {
        currentTrack = track
        isPlaying = true

        val notification = buildMediaNotification(track, isPlaying = true)
        startForeground(NOTIFICATION_ID, notification)
    }

    fun pausePlayback() {
        isPlaying = false
        currentTrack?.let {
            val notification = buildMediaNotification(it, isPlaying = false)
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.notify(NOTIFICATION_ID, notification)
        }
    }

    fun resumePlayback() {
        isPlaying = true
        currentTrack?.let {
            val notification = buildMediaNotification(it, isPlaying = true)
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.notify(NOTIFICATION_ID, notification)
        }
    }

    fun stopForegroundPlayback() {
        isPlaying = false
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun buildMediaNotification(track: Track, isPlaying: Boolean): Notification {
        val openAppIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
        val pendingOpenApp = PendingIntent.getActivity(
            this,
            0,
            openAppIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle(track.title)
            .setContentText("${track.artist} • MR Music")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentIntent(pendingOpenApp)
            .setOngoing(isPlaying)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    companion object {
        const val CHANNEL_ID = "mr_music_channel"
        const val NOTIFICATION_ID = 1001

        const val ACTION_PLAY = "com.mrmusic.player.ACTION_PLAY"
        const val ACTION_PAUSE = "com.mrmusic.player.ACTION_PAUSE"
        const val ACTION_STOP = "com.mrmusic.player.ACTION_STOP"
    }
}
