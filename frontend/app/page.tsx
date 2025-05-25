"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  Play,
  Users,
  Shield,
  Lightbulb,
} from "lucide-react";
import { ChatInterface } from "@/components/chat-interface";
import { useChatStore } from "@/lib/store";
import { useState } from "react";

export default function Home() {
  const { chats, createChat } = useChatStore();
  const [showChat, setShowChat] = useState(chats.length > 0);

  const handleGetStarted = () => {
    if (chats.length === 0) {
      createChat();
    }
    setShowChat(true);
  };

  if (showChat) {
    return <ChatInterface onBackToLanding={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 overflow-hidden relative">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-950/15 to-blue-950/15 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-950/15 to-purple-950/15 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-slate-950/8 to-gray-950/8 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Header */}
      <motion.header
        className="relative z-10 flex justify-between items-center p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Manimatic
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            variant="outline"
            onClick={handleGetStarted}
            className="border-gray-700 text-gray-400 hover:bg-gray-900 hover:text-gray-200 transition-all duration-300"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.header>

      <div className="relative z-10 px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            >
              Manimatic
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-500 mb-8 leading-relaxed font-light max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            >
              Transform complex concepts into elegant visualizations.
              <br />
              <span className="text-gray-600">
                Where ideas meet intelligent animation.
              </span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-gray-200 border border-gray-800 px-8 py-4 text-lg shadow-2xl"
                >
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:bg-gray-900 hover:text-gray-200 px-8 py-4 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          className="py-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-300 mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Everything you need to create stunning educational animations and
              visualizations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-900/50 shadow-xl"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Brain className="h-12 w-12 text-gray-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                AI-Powered Intelligence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI understands your concepts and creates stunning
                visualizations that make complex ideas simple to understand.
              </p>
            </motion.div>

            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-900/50 shadow-xl"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Zap className="h-12 w-12 text-gray-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Lightning Fast
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Generate complex animations in seconds. No more waiting hours
                for renders or struggling with complicated software.
              </p>
            </motion.div>

            <motion.div
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-900/50 shadow-xl"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Sparkles className="h-12 w-12 text-gray-500 mb-6" />
              <h3 className="text-xl font-semibold mb-4 text-gray-300">
                Educational Focus
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Perfect for students, teachers, and professionals who want to
                understand and explain complex concepts visually.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Use Cases Section */}
        <motion.div
          className="py-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-300 mb-4">
              Perfect For
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Whether you're learning, teaching, or presenting, Manimatic helps
              you visualize any concept
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "Students",
                desc: "Understand complex topics through visual learning",
              },
              {
                icon: Lightbulb,
                title: "Educators",
                desc: "Create engaging lessons that stick with students",
              },
              {
                icon: Brain,
                title: "Researchers",
                desc: "Visualize data and concepts for presentations",
              },
              {
                icon: Shield,
                title: "Professionals",
                desc: "Explain technical concepts to stakeholders",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-gray-900/30 text-center"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <item.icon className="h-10 w-10 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Examples Section */}
        <motion.div
          className="py-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-300 mb-4">
              What You Can Create
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              From algorithms to physics, from biology to mathematics -
              visualize any concept
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              "Neural Network Architecture",
              "Sorting Algorithms",
              "Physics Simulations",
              "Mathematical Functions",
              "Biological Processes",
              "Data Structures",
              "Chemical Reactions",
              "Economic Models",
              "Engineering Concepts",
            ].map((example, index) => (
              <motion.div
                key={example}
                className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-gray-900/40 text-center"
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <p className="text-gray-400 font-medium">{example}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="py-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl font-bold text-gray-300 mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners and educators who are already using
            Manimatic to bring their ideas to life.
          </p>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-gray-200 border border-gray-800 px-12 py-4 text-xl shadow-2xl"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="py-12 border-t border-gray-900/50 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
        >
          <p className="text-gray-600">
            © 2025 Manimatic. Transforming ideas into intelligent animations.
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
