import React from "react";

const PerspectiveName = () => (
  <span className="text-perspective-500 font-bold">Perspective</span>
);

export default function About() {
  return (
    <div className="p-8 pt-24 max-w-4xl mx-auto font-mono">
      <h1 className="text-4xl font-medium mb-16">
        First time on <PerspectiveName />? 👀
      </h1>

      <div className="space-y-12">
        {/* Introduction */}
        <div>
          <h3 className="text-2xl font-medium mb-4">Get honest answers from the other side 👩 👨</h3>
          <p className="ml-4">
            Ever had a question about the opposite gender but didn’t know how to ask?<br /><br />
            Maybe you’ve wondered what they really think, or why they act a certain way — but it feels too personal or awkward to bring up with your friends.<br /><br />
            That’s where <PerspectiveName /> comes in. Ask anonymously. Answer honestly. No pressure, no judgment.<br /><br />
            Once the chat ends, the messages disappear. No history, no trace — just a safe space to get a fresh perspective. 💬
          </p>
        </div>
        {/* How it works */}
        <div>
          <h3 className="text-2xl font-medium mb-4">How it works</h3>
          <ul className="ml-4 space-y-4 mb-4">
            <li>1. Get matched: Start a convo with someone from the other side (or your side — totally up to you).</li>
            <li>2. Ask what you've always wanted to 🍵</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
