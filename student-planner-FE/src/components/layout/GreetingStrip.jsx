import { getGreeting } from "../../utils/dateHelpers";

export function GreetingStrip({ displayName, subtitle }) {
  const greeting = getGreeting();

  return (
    <section className="greeting-strip">
      <p className="greeting-title">
        {greeting}, <span>{displayName}</span>
      </p>
      <p className="greeting-sub">{subtitle}</p>
    </section>
  );
}

