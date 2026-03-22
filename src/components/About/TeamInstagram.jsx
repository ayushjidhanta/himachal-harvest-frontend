import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "./About.module.css";

const API_URL = process.env.REACT_APP_API_URL;

const normalizeProfile = (username, data) => {
  const safeUsername = String(username || "").trim();
  const profileUrl = `https://www.instagram.com/${safeUsername}/`;

  return {
    username: safeUsername,
    profileUrl,
    displayName: data?.displayName || safeUsername,
    bio: data?.bio || "",
    profilePicUrl: data?.profilePicUrl || "",
    followers: data?.followers || "",
    following: data?.following || "",
    posts: data?.posts || "",
  };
};

export default function TeamInstagram({ usernames }) {
  const list = useMemo(
    () => (Array.isArray(usernames) ? usernames.map((u) => String(u || "").trim()).filter(Boolean) : []),
    [usernames]
  );

  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState(() => list.map((u) => normalizeProfile(u, null)));

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        if (!API_URL) {
          if (!cancelled) setProfiles(list.map((u) => normalizeProfile(u, null)));
          return;
        }

        const responses = await Promise.all(
          list.map(async (username) => {
            try {
              const { data } = await axios.get(`${API_URL}/social/instagram/${encodeURIComponent(username)}`);
              return normalizeProfile(username, data?.data || null);
            } catch {
              return normalizeProfile(username, null);
            }
          })
        );

        if (!cancelled) setProfiles(responses);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [list]);

  return (
    <section className={styles.teamSection} aria-label="Our team">
      <div className={styles.teamHeader}>
        <h2 className={styles.teamTitle}>Our Team</h2>
        <p className={styles.teamSubtitle}>
          Meet the people behind Himachal Harvest.
          {loading ? <span className={styles.teamLoading}> Loading profiles…</span> : null}
        </p>
      </div>

      <div className={styles.teamGrid}>
        {profiles.map((p) => (
          <a
            key={p.username}
            className={styles.teamCard}
            href={p.profileUrl}
            target="_blank"
            rel="noreferrer"
          >
            <div className={styles.avatarWrap}>
              {p.profilePicUrl ? (
                <img className={styles.avatar} src={p.profilePicUrl} alt={`${p.displayName} profile`} />
              ) : (
                <div className={styles.avatarFallback} aria-hidden="true">
                  {String(p.displayName || p.username || "?").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            <div className={styles.teamCardBody}>
              <div className={styles.teamName}>{p.displayName}</div>
              <div className={styles.teamHandle}>@{p.username}</div>

              {(p.followers || p.following || p.posts) && (
                <div className={styles.teamStats} aria-label="Instagram stats">
                  {p.followers ? <span className={styles.statPill}>{p.followers} followers</span> : null}
                  {p.following ? <span className={styles.statPill}>{p.following} following</span> : null}
                  {p.posts ? <span className={styles.statPill}>{p.posts} posts</span> : null}
                </div>
              )}

              {p.bio ? <div className={styles.teamBio}>{p.bio}</div> : null}

              <div className={styles.teamLinkRow}>
                <span className={styles.teamLink}>View on Instagram →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

