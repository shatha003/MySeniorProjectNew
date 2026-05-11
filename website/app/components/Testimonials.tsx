"use client";

import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";
import Image from "next/image";

interface Testimonial {
  quote: string;
  name: string;
  age: string;
}

export default function Testimonials() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  const testimonials: Testimonial[] = [
    {
      quote: "Amazing Application! Very beneficial for avoiding dangerous/harmful files online. I found the 'File Checker' and the 'Link Checker' to be extremely helpful and accurate at detecting malicious data. The Phishing dojo is an incredible tool that I'm very fond of. Lately, I've been applying to universities all around the world, and the dojo is an excellent feature that helps with detecting scam emails.",
      name: "Bilal",
      age: "10 years old",
    },
    {
      quote: "Honestly I have always felt that most of the educational type apps are kind of boring and bland, but CHEA is actually legit. The UI is clean and feels like a real pro tool. And since I am often downloading a lot of stuffs from the internet, the File Checker and Link Checker are the best ones for me - it's awesome being able to scan things before I open them. I do also like to play Quiz Arena trying to get a high score. It's a really smart way to show us how to stay safe and learn without having go through long boring theory videos about it. Seeing all these features and many more in the app work together so smoothly is pretty impressive for a senior project ngl.",
      name: "Ahlam",
      age: "15 years old",
    },
    {
      quote: "Something I appreciate the most about CHEA is that it respects the user's intelligence. It's not one of those dumbed down apps and yet it's still easy to navigate. I feel Phishing Dojo is incredibly innovative because it actually teaches you what to look for in the real world which is very crucial nowadays. My absolute favorite feature in the app is the Treasure Box as I am always forgetting my passwords, so having one secure place to store everything is a lifesaver. And I also love being able to customize my Agent which makes the whole experience feel personal. Lastly, It's a solid 10/10 app, and a well thought out planned and executed system that I would love to see published in the near future.",
      name: "Ayesha",
      age: "11 years old",
    },
    {
      quote: "I think CHEA is an amazing app because it doesn't feel like a normal university project. My favorite part of the app is definitely the Training Grounds. The games make it way more fun and easy to learn about internet safety than just reading on a website. I also really am fond of the Password Maker, it creates these really strong, hard-to-hack passwords for me, which is great because I used to just use one password for everything, and since I can't remember those long passwords, I put them all in the Treasure Box vault. It's a great tool as I always tend to forget passwords. I believe other kids my age would actually want to use this in their everyday life.",
      name: "Abdulrahman",
      age: "17 years old",
    },
    {
      quote: "Being into gaming and competitive sports, I spend a lot of time online. CHEA's Link Checker is my go-to before clicking any game link or team website. The Phishing Dojo is actually fun - it's like a game where you learn to spot scams. I usually hate those boring safety videos, but the Quiz Arena is different, I can compete with my friends and learn at the same time. The Password Maker is clutch too, I used to use 'password123' for everything but now I have unbreakable passwords stored safely in Treasure Box.",
      name: "Ahmad",
      age: "14 years old",
    },
    {
      quote: "I love scrolling through social media and following fashion accounts. My cousin showed me CHEA - she built it as her senior project! At first I thought it would be boring, but the Phishing Dojo actually taught me to spot fake accounts and scam DMs - super useful! My favorite feature is customizing my Agent, I made mine with pink and purple colors to match my style. The Treasure Box is amazing too, I have passwords for all my accounts stored securely. The whole app feels really modern and not like a university project at all - I'd definitely recommend it to my friends.",
      name: "Ayah",
      age: "14 years old",
    },
  ];

  if (!mounted) {
    return (
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-crimson/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-headline font-semibold tracking-wider uppercase mb-6 bg-neon-crimson/10 text-neon-crimson border border-neon-crimson/20">
              USER_FEEDBACK_V1.0
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
              What Users Say
            </h2>
            <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
              Real feedback from young digital defenders.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-3xl bg-surface-container-low/50 border border-outline-variant/10 backdrop-blur-sm"
              >
                <p className="text-on-surface-variant/80 leading-relaxed font-body text-sm mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
                    <Image
                      src={`/avatars/avatar${index + 5}.png`}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-headline font-semibold text-on-surface text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-on-surface-variant/60 text-xs font-body">
                      {testimonial.age}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-b from-transparent pointer-events-none ${
          isDark ? "via-neon-crimson/5" : "via-neon-violet/5"
        } to-transparent`}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-headline font-semibold tracking-wider uppercase mb-6 border ${
              isDark
                ? "bg-neon-crimson/10 text-neon-crimson border-neon-crimson/20"
                : "bg-neon-violet/10 text-neon-violet border-neon-violet/20"
            }`}
          >
            USER_FEEDBACK_V1.0
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-on-surface mb-4">
            What Users Say
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto text-lg font-body">
            Real feedback from young digital defenders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`p-6 rounded-3xl border backdrop-blur-sm transition-all duration-500 h-full ${
                  isDark
                    ? "bg-surface-container-low/50 border-outline-variant/10 hover:bg-surface-container-high/80 hover:border-neon-crimson/30"
                    : "bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-high/90 hover:border-neon-violet/30"
                }`}
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${
                    isDark
                      ? "from-neon-crimson to-neon-crimson/70"
                      : "from-neon-violet to-neon-violet/70"
                  }`}
                />

                <p
                  className={`text-sm leading-relaxed font-body mb-6 ${
                    isDark
                      ? "text-on-surface-variant/80"
                      : "text-on-surface-variant/90"
                  }`}
                >
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
                    <Image
                      src={`/avatars/avatar${index + 5}.png`}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-headline font-semibold text-on-surface text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-on-surface-variant/60 text-xs font-body">
                      {testimonial.age}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className={`mt-16 mx-auto w-32 h-px ${
            isDark
              ? "bg-gradient-to-r from-transparent via-neon-crimson/50 to-transparent"
              : "bg-gradient-to-r from-transparent via-neon-violet/50 to-transparent"
          }`}
        />
      </div>
    </section>
  );
}