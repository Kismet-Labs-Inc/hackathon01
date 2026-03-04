/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        coral: "#E8744A",
        dark: "#0A0A0A",
        card: "#1A1A1A",
        "card-warm": "#2A1C18",
        "bg-warm": "#211511",
        "coral-muted": "#E8744A99",
        mint: "#0DF2A6",
        teal: "#2DD4BF",
      },
      fontFamily: {
        jakarta: ["PlusJakartaSans_400Regular"],
        "jakarta-medium": ["PlusJakartaSans_500Medium"],
        "jakarta-semibold": ["PlusJakartaSans_600SemiBold"],
        "jakarta-bold": ["PlusJakartaSans_700Bold"],
        "jakarta-extrabold": ["PlusJakartaSans_800ExtraBold"],
      },
      borderRadius: {
        full: "9999px",
      },
    },
  },
  plugins: [],
};
