package com.mrmusic.player.model

/**
 * Data representation of an audio track in Kotlin for MR Music.
 */
data class Track(
    val id: String,
    val title: String,
    val artist: String,
    val album: String = "Telugu Romance",
    val durationSeconds: Double = 0.0,
    val audioUrl: String? = null,
    val coverUrl: String? = null,
    val isOfflineCached: Boolean = true,
    val addedAt: Long = System.currentTimeMillis()
)
