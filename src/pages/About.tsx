
import React from "react";

const PerspectiveName = () => (
  <span className="text-perspective-500 font-bold">Perspective</span>
);

export default function About() {
  return (
    <div className="p-8 pt-24 font-roboto">
      <h1 className="text-4xl font-medium mb-12">
        New to <PerspectiveName />?
      </h1>

      <h3 className="text-2xl font-medium mb-2">Introduction:</h3>
      <p className="ml-4 mb-4">
        Curious about your crush's perspective? Chat anonymously on Perspective with someone who
        shares your crush's gender and sexuality! Whether you're seeking advice or just want to yap about
        the situation 🤷‍♀️, this is your space. You can join as either a perspective giver or a getter. Who
        doesn't love a little tea about someone else's relationship before bed? 
      </p>

      <h3 className="text-2xl font-medium mb-2">Here's how it works:</h3>
      <ul className="ml-4 mb-4">
        <li>1. Choose to get a perspective (💡) or give a perspective (🍵👀).</li>
        <li>
          2. Match anonymously based on preferences like gender and sexuality, ensuring the advice feels
          relevant and personal.
        </li>
        <li>
          3. Start chatting, ask questions, and share insights—all in a safe space where your conversation
          disappears after the session.
        </li>
      </ul>

      <h3 className="text-2xl font-medium mb-2">Who is it for?:</h3>
      <p className="ml-4 mb-4">
        <PerspectiveName /> is for everyone. It's a welcoming space for people of all genders and sexualities to
        give or receive advice, gain clarity, and understand relationships from new angles.
      </p>
    </div>
  );
}
