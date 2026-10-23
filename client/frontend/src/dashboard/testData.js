const testData = {
    compressedTopItems: {
        artists: {
            shortTerm: [
                {
                    name: "Kendrick Lamar",
                    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
                    spotifyLink: "https://open.spotify.com/artist/2YZyloF8N0Wb9xzh1NhZWg",
                    position: 1
                },
                {
                    name: "Playboi Carti",
                    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500",
                    spotifyLink: "https://open.spotify.com/artist/699OTQXzgjhIYAHMy9RyPD",
                    position: 2
                },
                {
                    name: "A$AP Rocky",
                    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500",
                    spotifyLink: "https://open.spotify.com/artist/13ubrt8OPOJRC+...",
                    position: 3
                },
                {
                    name: "Tyler, The Creator",
                    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500",
                    spotifyLink: "https://open.spotify.com/artist/4V8LLVI7PbaPR0K2TGSxFF",
                    position: 4
                },
                {
                    name: "Kanye West",
                    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500",
                    spotifyLink: "https://open.spotify.com/artist/5K4W6rqBFWDnAN6FQUkS6x",
                    position: 5
                }
            ],
            mediumTerm: [
                {
                    name: "Travis Scott",
                    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
                    spotifyLink: "https://open.spotify.com/artist/0Y5tJX1MQlPlqiwlOH1tJY",
                    position: 1
                },
                {
                    name: "Future",
                    image: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500",
                    spotifyLink: "https://open.spotify.com/artist/1Ryvyy8hxzRjzVMJKUMm1b",
                    position: 2
                },
                {
                    name: "Young Thug",
                    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
                    spotifyLink: "https://open.spotify.com/artist/50co4IsCDNYICm205rR0gK",
                    position: 3
                },
                {
                    name: "Gunna",
                    image: "https://images.unsplash.com/photo-1520523839896-5aa4286f941c?w=500",
                    spotifyLink: "https://open.spotify.com/artist/2hlmm7wMICOK1dZMnMWYEU",
                    position: 4
                },
                {
                    name: "Metro Boomin",
                    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500",
                    spotifyLink: "https://open.spotify.com/artist/0izaZbcmUAUebj4ZgW1Gq5",
                    position: 5
                }
            ],
            longTerm: [
                {
                    name: "Guns N' Roses",
                    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=500",
                    spotifyLink: "https://open.spotify.com/artist/3qm84nboxUEQ2vnTfUTTFC",
                    position: 1
                },
                {
                    name: "2Pac",
                    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500",
                    spotifyLink: "https://open.spotify.com/artist/1ZwdSsrxhbi8CAI2qPFExn",
                    position: 2
                },
                {
                    name: "Outkast",
                    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
                    spotifyLink: "https://open.spotify.com/artist/1G9G7WvxXka3ZMsDgzWCAL",
                    position: 3
                },
                {
                    name: "Eazy-E",
                    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
                    spotifyLink: "https://open.spotify.com/artist/6PZYzotWEepb1g88uX4jVp",
                    position: 4
                },
                {
                    name: "Pusha T",
                    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
                    spotifyLink: "https://open.spotify.com/artist/0ONHwAv99xZ8v1191z5b5E",
                    position: 5
                }
            ]
        },
        tracks: {
            shortTerm: [
                {
                    name: "HUMBLE.",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
                    artists: ["Kendrick Lamar"],
                    spotifyLink: "https://open.spotify.com/track/7KXjTSCq5nL1LoYtL7XAwS",
                    position: 1
                },
                {
                    name: "FEIN.",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
                    artists: ["Travis Scott", "Playboi Carti"],
                    spotifyLink: "https://open.spotify.com/track/42VwDDrmYDJqIhY1mUha8n",
                    position: 2
                },
                {
                    name: "Praise The Lord (Da Shine)",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500",
                    artists: ["A$AP Rocky", "Skepta"],
                    spotifyLink: "https://open.spotify.com/track/7ycWlvq1GiBl3qPEXnE7hZ",
                    position: 3
                },
                {
                    name: "EARFQUAKE",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
                    artists: ["Tyler, The Creator"],
                    spotifyLink: "https://open.spotify.com/track/5hVghJ4KaYES3BFUATCYn0",
                    position: 4
                },
                {
                    name: "OFF THE GRID",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=500",
                    artists: ["Kanye West", "Playboi Carti", "Fivio Foreign"],
                    spotifyLink: "https://open.spotify.com/track/2GbMPZgVnL8NDRVCdPNfSv",
                    position: 5
                }
            ],
            mediumTerm: [
                {
                    name: "SICKO MODE",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500",
                    artists: ["Travis Scott"],
                    spotifyLink: "https://open.spotify.com/track/2xLMifQCjDGFmkHkpNLD9h",
                    position: 1
                },
                {
                    name: "CARNIVAL",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500",
                    artists: ["¥$", "Kanye West", "Ty Dolla $ign", "Rich The Kid", "Playboi Carti"],
                    spotifyLink: "https://open.spotify.com/track/3w2UjWNnzltbF4C3uX58Jb",
                    position: 2
                },
                {
                    name: "Mask Off",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500",
                    artists: ["Future"],
                    spotifyLink: "https://open.spotify.com/track/3gBuogDGuP3Vb38hNCOJm9",
                    position: 3
                },
                {
                    name: "King's Dead",
                    isLocal: true,
                    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
                    artists: ["Jay Rock", "Kendrick Lamar", "Future", "James Blake"],
                    spotifyLink: "https://open.spotify.com/track/3IKwFtchhXqyM68O2vV1vK",
                    position: 4
                },
                {
                    name: "fukumean",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?w=500",
                    artists: ["Gunna"],
                    spotifyLink: "https://open.spotify.com/track/4r6eECkJ6QITWxnfffyIlW",
                    position: 5
                }
            ],
            longTerm: [
                {
                    name: "Sweet Child O' Mine",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=500",
                    artists: ["Guns N' Roses"],
                    spotifyLink: "https://open.spotify.com/track/7o2CTH4ctstm8TNelqjb51",
                    position: 1
                },
                {
                    name: "Ambitionz Az A Ridah",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500",
                    artists: ["2Pac"],
                    spotifyLink: "https://open.spotify.com/track/218ugIlFBNVpWq05T20Tqj",
                    position: 2
                },
                {
                    name: "Hey Ya!",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
                    artists: ["Outkast"],
                    spotifyLink: "https://open.spotify.com/track/2PpruihPAjjW64RDJiaAMW",
                    position: 3
                },
                {
                    name: "Boyz-n-the-Hood",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
                    artists: ["Eazy-E"],
                    spotifyLink: "https://open.spotify.com/track/3vK6v8h0N4b84k0xX4wWk0",
                    position: 4
                },
                {
                    name: "Diet Coke",
                    isLocal: false,
                    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
                    artists: ["Pusha T"],
                    spotifyLink: "https://open.spotify.com/track/4gKzI6gO9HnZ5lZ30Jm3uS",
                    position: 5
                }
            ]
        }
    },
    userProfile: {
        id: "user_spotify_id",
        display_name: "John Doe",
        email: "john@example.com",
        images: [
            {
                url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
            }
        ]
    }
};

export default testData;