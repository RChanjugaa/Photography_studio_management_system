export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { display: ["Playfair Display","Georgia","serif"] },
      animation: { fadeUp: "fadeUp .25s ease both" },
      keyframes: { fadeUp: { from:{ opacity:0,transform:"translateY(8px)" }, to:{ opacity:1,transform:"translateY(0)" } } }
    }
  },
  plugins: []
}
