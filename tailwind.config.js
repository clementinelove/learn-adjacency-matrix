module.exports = {
    purge: ["./src/styles/main.css"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                roboto: 'Roboto, sans-serif',
                frank: 'Frank Ruhl Libre, serif',
                comfortaa: 'Comfortaa, sans-serif',
                lexend: 'Lexend, sans-serif',
                cantarell: 'Cantarell, sans-serif',
                kufam: 'Kufam, cursive',
                merriweather: 'Merriweather, serif',
                merriweathersans: 'Merriweather Sans, sans-serif',
                opensans: 'Open Sans, sans-serif'
            },
            width: {
                '128': '32rem',
                '144': '36rem',
                '288': '72rem'
            }
        },
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            borderColor: ['active'],
            textColor: ['active'],
        },
    },
    plugins: [],
}
