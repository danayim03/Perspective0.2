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
          <h3 className="text-2xl font-medium mb-4">See the other side. 🔮</h3>
          <p className="ml-4">
            Ever wished what the opposite gender really thinks?<br />
            Why do they do that? What do they actually mean?
            <br /><br />
            On <PerspectiveName />, you can anonymously get or give advice from another angle.<br />
            No judgement. No background info. Just real talk.
          </p>
        </div>

        {/* How it works */}
        <div>
          <h3 className="text-2xl font-medium mb-4">How it works</h3>
          <ul className="ml-4 space-y-2">
            <li>1. Choose your role: Are you here to ask for a perspective (💡) or give one (🍵)?</li>
            <li>2. Get matched: Chat with someone of the opposite gender (or the same gender!).</li>
            <li>3. Talk. Ask. Unravel the mystery: Your convo disappears after the session. 💬</li>
          </ul>
        </div>

        {/* Who is it for? */}
        <div>
          <h3 className="text-2xl font-medium mb-4">Who is this for?</h3>
          <p className="ml-4 mb-14">
            <PerspectiveName /> is for anyone who needs to spill the tea without the drama.<br /><br />
            You started dating your boss and don't know what to do? Don't know if your girlfriend actually likes to cuddle for hours? You're bored and just looking for some hot tea at 2am?<br />
            Get the unfiltered take from a stranger, without having to worry about the consequences 🍵.
          </p>
        </div>
      </div>
    </div>
  );
}
