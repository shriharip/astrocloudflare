const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter Var", "Anek Kannada Variable"]
			},
		},
	},
	plugins: [
		require('daisyui'),
		require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({
      generateContainer: false,
      gridGutterWidth: "2rem",
      gridGutters: {
        1: "0.25rem",
        2: "0.5rem",
        3: "1rem",
        4: "1.5rem",
        5: "3rem",
      },
    }),
	],
	daisyui: {
    themes: [
			"nord",
			"dark",
			"retro",
			"coffee",
			"dracula",
			"cyberpunk",
			"business",
		],
		darkTheme: "business",
  },
};
