import { THRESHOLD } from "~/components/layout/Header/hooks/useVisibility/constants";

export default function Home() {
  return (
    <main className="wrapper flex grow flex-col xs:items-center">
      <h1 className="bu mb-4 w-fit font-semibold Text-red-500/pink-500 xs:bu-hide-center before:w-0.1em before:duration-250 hover:bu-show ~xs/md2:~text-8/14">
        next-starter
      </h1>
      <p className="~xs/md2:~text-5/7 xs:text-center">
        This is a <u>simple</u> Next.JS starter template equipped with:
      </p>
      <ul className="mt-8 grid max-w-screen-lg list-inside list-decimal gap-4 text-foreground-secondary">
        {features.map((feature, index) => (
          <li
            key={index}
            className="rounded-8 bg-black bg-opacity-7 bg-gradient-to-r from-transparent to-gray-600/20 px-6 py-4 duration-250 b-1 B-gray-400/gray-600 hover:bg-opacity-12 ~xs/md2:~text-4/5 dark:bg-white dark:bg-opacity-10 dark:hover:bg-opacity-15"
          >
            {feature}
          </li>
        ))}
      </ul>
    </main>
  );
}

const features = [
  "Tailwind CSS with custom preset and plugins.",
  "Dark theme support with a toggler component.",
  `Header that hides on scroll down and shows on +${THRESHOLD}px scroll up.`,
  "Footer that sticks to the bottom :)",
] as const;
