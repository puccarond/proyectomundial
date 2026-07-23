/* =========================================================
   COPIA LOCAL DE RESPALDO
   Instantánea REAL descargada de la API del curso
   (https://wc-api-u378.onrender.com/wc-api/api/v1/...).
   Ningún dato aquí es inventado.

   Se carga como script y no con fetch, porque al abrir el sitio
   con doble clic (file://) el navegador bloquea la lectura de
   archivos locales. Solo se usa si la API no responde.

   COBERTURA (copia parcial):
     /v1/teams             48 selecciones, 12 grupos
     /v1/cities            16 ciudades sede con estadio y coordenadas
     /v1/matches           muestra del Grupo A (6 partidos)
     /v1/matches/15186720  detalle completo: alineaciones, estadísticas,
                           cronología y highlights
     /v1/ranking           derivado del campo world_ranking de /v1/teams
                           (los puntos FIFA quedan nulos: no se inventan)
     /v1/standings         los 12 grupos, tal como los devuelve la API (vacíos)

   NO cubiertos (la API no respondió al descargarlos): news, ball,
   sound, mascots, events y records. Esas páginas mostrarán
   "no disponible" si se abren sin conexión al API.

   Para la entrega final: eliminar este archivo y su etiqueta
   <script> de las 19 páginas, o poner FALLBACK_A_MOCK en false.
   ========================================================= */
var WC = window.WC = window.WC || {};
WC.MOCK = {
 "/v1/teams": [
  {
   "id": "BEL",
   "name": "Bélgica",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/BEL",
   "group": "G",
   "world_ranking": 9,
   "appearances": 15,
   "host": false
  },
  {
   "id": "NOR",
   "name": "Noruega",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/NOR",
   "group": "I",
   "world_ranking": 31,
   "appearances": 4,
   "host": false
  },
  {
   "id": "RSA",
   "name": "Sudáfrica",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/RSA",
   "group": "A",
   "world_ranking": 60,
   "appearances": 4,
   "host": false
  },
  {
   "id": "SCO",
   "name": "Escocia",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/SCO",
   "group": "C",
   "world_ranking": 42,
   "appearances": 9,
   "host": false
  },
  {
   "id": "ESP",
   "name": "España",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ESP",
   "group": "H",
   "world_ranking": 2,
   "appearances": 17,
   "host": false
  },
  {
   "id": "GHA",
   "name": "Ghana",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/GHA",
   "group": "L",
   "world_ranking": 72,
   "appearances": 5,
   "host": false
  },
  {
   "id": "CPV",
   "name": "Islas de Cabo Verde",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CPV",
   "group": "H",
   "world_ranking": 67,
   "appearances": 1,
   "host": false
  },
  {
   "id": "IRN",
   "name": "RI de Irán",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/IRN",
   "group": "G",
   "world_ranking": 20,
   "appearances": 7,
   "host": false
  },
  {
   "id": "USA",
   "name": "EE. UU.",
   "confederation": "CONCACAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/USA",
   "group": "D",
   "world_ranking": 17,
   "appearances": 12,
   "host": true
  },
  {
   "id": "COL",
   "name": "Colombia",
   "confederation": "CONMEBOL",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/COL",
   "group": "K",
   "world_ranking": 13,
   "appearances": 7,
   "host": false
  },
  {
   "id": "CRO",
   "name": "Croacia",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CRO",
   "group": "L",
   "world_ranking": 11,
   "appearances": 7,
   "host": false
  },
  {
   "id": "BIH",
   "name": "Bosnia y Herzegovina",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/BIH",
   "group": "B",
   "world_ranking": 64,
   "appearances": 2,
   "host": false
  },
  {
   "id": "EGY",
   "name": "Egipto",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/EGY",
   "group": "G",
   "world_ranking": 29,
   "appearances": 4,
   "host": false
  },
  {
   "id": "HAI",
   "name": "Haití",
   "confederation": "CONCACAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/HAI",
   "group": "C",
   "world_ranking": 83,
   "appearances": 2,
   "host": false
  },
  {
   "id": "ENG",
   "name": "Inglaterra",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ENG",
   "group": "L",
   "world_ranking": 4,
   "appearances": 17,
   "host": false
  },
  {
   "id": "IRQ",
   "name": "Irak",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/IRQ",
   "group": "I",
   "world_ranking": 57,
   "appearances": 2,
   "host": false
  },
  {
   "id": "CAN",
   "name": "Canadá",
   "confederation": "CONCACAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CAN",
   "group": "B",
   "world_ranking": 30,
   "appearances": 3,
   "host": true
  },
  {
   "id": "KSA",
   "name": "Arabia Saudí",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/KSA",
   "group": "H",
   "world_ranking": 61,
   "appearances": 7,
   "host": false
  },
  {
   "id": "AUT",
   "name": "Austria",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/AUT",
   "group": "J",
   "world_ranking": 24,
   "appearances": 8,
   "host": false
  },
  {
   "id": "COD",
   "name": "RD Congo",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/COD",
   "group": "K",
   "world_ranking": 46,
   "appearances": 2,
   "host": false
  },
  {
   "id": "POR",
   "name": "Portugal",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/POR",
   "group": "K",
   "world_ranking": 5,
   "appearances": 9,
   "host": false
  },
  {
   "id": "TUN",
   "name": "Túnez",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/TUN",
   "group": "F",
   "world_ranking": 45,
   "appearances": 7,
   "host": false
  },
  {
   "id": "CZE",
   "name": "Chequia",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CZE",
   "group": "A",
   "world_ranking": 40,
   "appearances": 10,
   "host": false
  },
  {
   "id": "JPN",
   "name": "Japón",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/JPN",
   "group": "F",
   "world_ranking": 18,
   "appearances": 8,
   "host": false
  },
  {
   "id": "NZL",
   "name": "Nueva Zelanda",
   "confederation": "OFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/NZL",
   "group": "G",
   "world_ranking": 85,
   "appearances": 3,
   "host": false
  },
  {
   "id": "URU",
   "name": "Uruguay",
   "confederation": "CONMEBOL",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/URU",
   "group": "H",
   "world_ranking": 16,
   "appearances": 15,
   "host": false
  },
  {
   "id": "GER",
   "name": "Alemania",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/GER",
   "group": "E",
   "world_ranking": 10,
   "appearances": 21,
   "host": false
  },
  {
   "id": "BRA",
   "name": "Brasil",
   "confederation": "CONMEBOL",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/BRA",
   "group": "C",
   "world_ranking": 6,
   "appearances": 23,
   "host": false
  },
  {
   "id": "TUR",
   "name": "Turquía",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/TUR",
   "group": "D",
   "world_ranking": 22,
   "appearances": 3,
   "host": false
  },
  {
   "id": "ECU",
   "name": "Ecuador",
   "confederation": "CONMEBOL",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ECU",
   "group": "E",
   "world_ranking": 23,
   "appearances": 5,
   "host": false
  },
  {
   "id": "FRA",
   "name": "Francia",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/FRA",
   "group": "I",
   "world_ranking": 3,
   "appearances": 17,
   "host": false
  },
  {
   "id": "MAR",
   "name": "Marruecos",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/MAR",
   "group": "C",
   "world_ranking": 7,
   "appearances": 7,
   "host": false
  },
  {
   "id": "NED",
   "name": "Países Bajos",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/NED",
   "group": "F",
   "world_ranking": 8,
   "appearances": 12,
   "host": false
  },
  {
   "id": "PAR",
   "name": "Paraguay",
   "confederation": "CONMEBOL",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/PAR",
   "group": "D",
   "world_ranking": 41,
   "appearances": 9,
   "host": false
  },
  {
   "id": "ALG",
   "name": "Argelia",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ALG",
   "group": "J",
   "world_ranking": 28,
   "appearances": 5,
   "host": false
  },
  {
   "id": "AUS",
   "name": "Australia",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/AUS",
   "group": "D",
   "world_ranking": 27,
   "appearances": 7,
   "host": false
  },
  {
   "id": "CIV",
   "name": "Costa de Marfil",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CIV",
   "group": "E",
   "world_ranking": 33,
   "appearances": 4,
   "host": false
  },
  {
   "id": "KOR",
   "name": "República de Corea",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/KOR",
   "group": "A",
   "world_ranking": 25,
   "appearances": 12,
   "host": false
  },
  {
   "id": "CUW",
   "name": "Curazao",
   "confederation": "CONCACAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CUW",
   "group": "E",
   "world_ranking": 82,
   "appearances": 1,
   "host": false
  },
  {
   "id": "JOR",
   "name": "Jordania",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/JOR",
   "group": "J",
   "world_ranking": 63,
   "appearances": 1,
   "host": false
  },
  {
   "id": "SEN",
   "name": "Senegal",
   "confederation": "CAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/SEN",
   "group": "I",
   "world_ranking": 15,
   "appearances": 4,
   "host": false
  },
  {
   "id": "UZB",
   "name": "Uzbekistán",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/UZB",
   "group": "K",
   "world_ranking": 50,
   "appearances": 1,
   "host": false
  },
  {
   "id": "MEX",
   "name": "México",
   "confederation": "CONCACAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/MEX",
   "group": "A",
   "world_ranking": 14,
   "appearances": 18,
   "host": true
  },
  {
   "id": "ARG",
   "name": "Argentina",
   "confederation": "CONMEBOL",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ARG",
   "group": "J",
   "world_ranking": 1,
   "appearances": 19,
   "host": false
  },
  {
   "id": "QAT",
   "name": "Catar",
   "confederation": "AFC",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/QAT",
   "group": "B",
   "world_ranking": 56,
   "appearances": 2,
   "host": false
  },
  {
   "id": "PAN",
   "name": "Panamá",
   "confederation": "CONCACAF",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/PAN",
   "group": "L",
   "world_ranking": 34,
   "appearances": 2,
   "host": false
  },
  {
   "id": "SWE",
   "name": "Suecia",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/SWE",
   "group": "F",
   "world_ranking": 38,
   "appearances": 13,
   "host": false
  },
  {
   "id": "SUI",
   "name": "Suiza",
   "confederation": "UEFA",
   "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/SUI",
   "group": "B",
   "world_ranking": 19,
   "appearances": 13,
   "host": false
  }
 ],
 "/v1/cities": [
  {
   "id": 1,
   "country": "Mexico",
   "name": "Mexico City",
   "description": [
    "La capital mexicana hace historia al albergar su tercera Copa del Mundo."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/52939278-8469-4fc2-82ce-8dd81ddb5f06/Mexico-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 19.302861,
     "longitude": -99.150528
    },
    "name": "Estadio Azteca",
    "capacity": 87523
   }
  },
  {
   "id": 2,
   "country": "United States",
   "name": "New York / New Jersey",
   "description": [
    "La metrópolis global alberga el partido más importante del torneo."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/df1fd696-aac7-432b-9416-68b3e78a12ec/NYNJ-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 40.813611,
     "longitude": -74.074444
    },
    "name": "MetLife Stadium",
    "capacity": 82500
   }
  },
  {
   "id": 3,
   "country": "United States",
   "name": "Los Angeles",
   "description": [
    "La capital del entretenimiento alberga el debut de la selección estadounidense."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/be412adf-e215-435e-8202-19bd8811d7e3/Los-Angeles-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 33.953333,
     "longitude": -118.339167
    },
    "name": "SoFi Stadium",
    "capacity": 70240
   }
  },
  {
   "id": 4,
   "country": "Canada",
   "name": "Toronto",
   "description": [
    "La ciudad multicultural por excelencia marca el inicio del torneo en suelo canadiense."
   ],
   "image_url": null,
   "stadium": {
    "coordinates": {
     "latitude": 43.632778,
     "longitude": -79.418611
    },
    "name": "BMO Field",
    "capacity": 45000
   }
  },
  {
   "id": 5,
   "country": "Mexico",
   "name": "Guadalajara",
   "description": [
    "Tierra del mariachi y el tequila, Guadalajara respira fútbol tradicional."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/aabded67-0478-4c1c-8053-7e1c43989d74/Guadalajara-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 20.681111,
     "longitude": -103.462778
    },
    "name": "Estadio Akron",
    "capacity": 48071
   }
  },
  {
   "id": 6,
   "country": "Mexico",
   "name": "Monterrey",
   "description": [
    "La potencia industrial del norte de México ofrece un paisaje montañoso espectacular."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/d8893cb8-fcf0-4755-ae4e-bd78ca191e7e/Monterrey-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 25.669167,
     "longitude": -100.244444
    },
    "name": "Estadio BBVA",
    "capacity": 53500
   }
  },
  {
   "id": 7,
   "country": "Canada",
   "name": "Vancouver",
   "description": [
    "Joya de la costa oeste canadiense, rodeada de montañas y el océano."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/090fe026-5361-434c-bd2b-6baa8f7b7fec/Vancouver-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 49.276667,
     "longitude": -123.111944
    },
    "name": "BC Place",
    "capacity": 54500
   }
  },
  {
   "id": 8,
   "country": "United States",
   "name": "Miami",
   "description": [
    "Epicentro cultural y puerta de enlace hacia América Latina."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/3b66b904-0861-4465-91d5-083e63a5e35d/Miami-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 25.958056,
     "longitude": -80.238889
    },
    "name": "Hard Rock Stadium",
    "capacity": 65326
   }
  },
  {
   "id": 9,
   "country": "United States",
   "name": "Dallas",
   "description": [
    "Una de las regiones con mayor crecimiento y pasión deportiva de Texas."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/bd5dc099-91ed-4a43-b64c-ce5e16c06e29/Dallas-Gallery-02",
   "stadium": {
    "coordinates": {
     "latitude": 32.747778,
     "longitude": -97.092778
    },
    "name": "AT&T Stadium",
    "capacity": 92967
   }
  },
  {
   "id": 10,
   "country": "United States",
   "name": "Atlanta",
   "description": [
    "El centro neurálgico del sureste estadounidense y cuna de los derechos civiles."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/25d15826-1750-4fcf-9c48-fd865e5befe3/Atlanta-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 33.755556,
     "longitude": -84.401
    },
    "name": "Mercedes-Benz Stadium",
    "capacity": 71000
   }
  },
  {
   "id": 11,
   "country": "United States",
   "name": "Kansas City",
   "description": [
    "Conocida como el corazón geográfico y futbolístico de los Estados Unidos."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/42b87a43-9e9c-4eca-adcd-3c8edc734d25/Kansas-city-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 39.048889,
     "longitude": -94.483889
    },
    "name": "Arrowhead Stadium",
    "capacity": 76416
   }
  },
  {
   "id": 12,
   "country": "United States",
   "name": "Houston",
   "description": [
    "Una urbe masiva de alta diversidad cultural y pasión por los deportes."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/99e92086-3a91-4507-bd0b-f50af922c652/Houston-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 29.684722,
     "longitude": -95.408056
    },
    "name": "NRG Stadium",
    "capacity": 72220
   }
  },
  {
   "id": 13,
   "country": "United States",
   "name": "Seattle",
   "description": [
    "La capital Esmeralda de la costa noroeste, famosa por su cultura futbolera."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/36d97050-7724-4ccb-a9bc-362412485f1a/Seattle-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 47.595278,
     "longitude": -122.331667
    },
    "name": "Lumen Field",
    "capacity": 69000
   }
  },
  {
   "id": 14,
   "country": "United States",
   "name": "San Francisco Bay Area",
   "description": [
    "El corazón tecnológico global de Silicon Valley abre sus puertas al fútbol."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/64fb548d-e7a8-44a8-a35c-6231ffb0e3fd/San-Francisco-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 37.403,
     "longitude": -121.97
    },
    "name": "Levi's Stadium",
    "capacity": 68500
   }
  },
  {
   "id": 15,
   "country": "United States",
   "name": "Boston",
   "description": [
    "Una de las ciudades históricas más antiguas de los Estados Unidos."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/8a31f4d9-ade1-432b-b3b0-5a571c3bcba4/Boston-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 42.090833,
     "longitude": -71.264167
    },
    "name": "Gillette Stadium",
    "capacity": 65878
   }
  },
  {
   "id": 16,
   "country": "United States",
   "name": "Philadelphia",
   "description": [
    "Cuna de la declaración de la independencia estadounidense."
   ],
   "image_url": "https://digitalhub.fifa.com/transform/39b7dce5-d28c-4b31-b69d-05bda12339fc/Philadelphia-Gallery-01",
   "stadium": {
    "coordinates": {
     "latitude": 39.900833,
     "longitude": -75.1675
    },
    "name": "Lincoln Financial Field",
    "capacity": 69796
   }
  }
 ],
 "/v1/matches": [
  {
   "id": 15186720,
   "date": "2026-06-11",
   "time": "22:00:00",
   "status": "Ended",
   "round": 1,
   "group": "A",
   "referee": "Amin Mohamed Omar",
   "city_id": 5,
   "home_id": "KOR",
   "away_id": "CZE",
   "home_score": {
    "total": 2,
    "penalty": 0
   },
   "away_score": {
    "total": 1,
    "penalty": 0
   }
  },
  {
   "id": 15186710,
   "date": "2026-06-11",
   "time": "15:00:00",
   "status": "Ended",
   "round": 1,
   "group": "A",
   "referee": "Wilton SAMPAIO",
   "city_id": 1,
   "home_id": "MEX",
   "away_id": "RSA",
   "home_score": {
    "total": 2,
    "penalty": 0
   },
   "away_score": {
    "total": 0,
    "penalty": 0
   }
  },
  {
   "id": 15186731,
   "date": "2026-06-18",
   "time": "12:00:00",
   "status": "Ended",
   "round": 2,
   "group": "A",
   "referee": "Tori Penso",
   "city_id": 10,
   "home_id": "CZE",
   "away_id": "RSA",
   "home_score": {
    "total": 1,
    "penalty": 0
   },
   "away_score": {
    "total": 1,
    "penalty": 0
   }
  },
  {
   "id": 15186490,
   "date": "2026-06-18",
   "time": "21:00:00",
   "status": "Ended",
   "round": 2,
   "group": "A",
   "referee": "Gustavo Tejera",
   "city_id": 5,
   "home_id": "MEX",
   "away_id": "KOR",
   "home_score": {
    "total": 1,
    "penalty": 0
   },
   "away_score": {
    "total": 0,
    "penalty": 0
   }
  },
  {
   "id": 15186744,
   "date": "2026-06-24",
   "time": "21:00:00",
   "status": "Not started",
   "round": 3,
   "group": "A",
   "referee": "Facundo TELLO",
   "city_id": 6,
   "home_id": "RSA",
   "away_id": "KOR",
   "home_score": {
    "total": 0,
    "penalty": 0
   },
   "away_score": {
    "total": 0,
    "penalty": 0
   }
  },
  {
   "id": 15186732,
   "date": "2026-06-24",
   "time": "21:00:00",
   "status": "Not started",
   "round": 3,
   "group": "A",
   "referee": "Yael Falcón Pérez",
   "city_id": 1,
   "home_id": "CZE",
   "away_id": "MEX",
   "home_score": {
    "total": 0,
    "penalty": 0
   },
   "away_score": {
    "total": 0,
    "penalty": 0
   }
  }
 ],
 "/v1/standings": {
  "A": [],
  "B": [],
  "C": [],
  "D": [],
  "E": [],
  "F": [],
  "G": [],
  "H": [],
  "I": [],
  "J": [],
  "K": [],
  "L": []
 },
 "/v1/matches/15186720": {
  "id": 15186720,
  "date": "2026-06-11",
  "time": "22:00:00",
  "status": "Ended",
  "round": 1,
  "group": "A",
  "referee": "Amin Mohamed Omar",
  "city": {
   "id": 5,
   "country": "Mexico",
   "name": "Guadalajara",
   "stadium": {
    "name": "Estadio Akron",
    "capacity": 48071,
    "coordinates": {
     "latitude": 20.681111,
     "longitude": -103.462778
    }
   }
  },
  "home_team": {
   "id": "KOR",
   "name": "República de Corea",
   "confederation": "AFC",
   "flag_uri": "https://api.fifa.com/api/v3/picture/flags-sq-5/KOR",
   "group": "A",
   "world_ranking": 25,
   "appearances": 12,
   "host": false
  },
  "away_team": {
   "id": "CZE",
   "name": "Chequia",
   "confederation": "UEFA",
   "flag_uri": "https://api.fifa.com/api/v3/picture/flags-sq-5/CZE",
   "group": "A",
   "world_ranking": 40,
   "appearances": 10,
   "host": false
  },
  "home_score": {
   "total": 2,
   "period1": 0,
   "period2": 2,
   "extra_time": 0,
   "penalty": 0
  },
  "away_score": {
   "total": 1,
   "period1": 0,
   "period2": 1,
   "extra_time": 0,
   "penalty": 0
  },
  "line_ups": {
   "home": {
    "formation": "3-4-2-1",
    "coach": "Myung Bo Hong",
    "starting_players": [
     {
      "number": 1,
      "name": "KIM Seunggyu",
      "position": "Arquero"
     },
     {
      "number": 2,
      "name": "LEE Hanbeom",
      "position": "Defensor"
     },
     {
      "number": 4,
      "name": "KIM Minjae",
      "position": "Defensor"
     },
     {
      "number": 3,
      "name": "LEE Gihyuk",
      "position": "Mediocampista"
     },
     {
      "number": 22,
      "name": "SEOL Youngwoo",
      "position": "Defensor"
     },
     {
      "number": 6,
      "name": "HWANG Inbeom",
      "position": "Mediocampista"
     },
     {
      "number": 8,
      "name": "PAIK Seungho",
      "position": "Mediocampista"
     },
     {
      "number": 13,
      "name": "LEE Taeseok",
      "position": "Defensor"
     },
     {
      "number": 19,
      "name": "LEE Kangin",
      "position": "Mediocampista"
     },
     {
      "number": 10,
      "name": "LEE Jaesung",
      "position": "Mediocampista"
     },
     {
      "number": 7,
      "name": "SON Heungmin",
      "position": "Delantero"
     }
    ],
    "substitutes": [
     {
      "number": 11,
      "name": "HWANG Heechan",
      "position": "Mediocampista"
     },
     {
      "number": 25,
      "name": "EOM Jisung",
      "position": "Mediocampista"
     },
     {
      "number": 18,
      "name": "OH Hyeongyu",
      "position": "Delantero"
     },
     {
      "number": 24,
      "name": "KIM Jingyu",
      "position": "Mediocampista"
     },
     {
      "number": 16,
      "name": "PARK Jinseob",
      "position": "Defensor"
     },
     {
      "number": 21,
      "name": "JO Hyeonwoo",
      "position": "Arquero"
     },
     {
      "number": 12,
      "name": "SONG Bumkeun",
      "position": "Arquero"
     },
     {
      "number": 15,
      "name": "KIM Moonhwan",
      "position": "Defensor"
     },
     {
      "number": 14,
      "name": "CHO Wije",
      "position": "Defensor"
     },
     {
      "number": 5,
      "name": "KIM Taehyeon",
      "position": "Defensor"
     },
     {
      "number": 26,
      "name": "LEE Donggyeong",
      "position": "Mediocampista"
     },
     {
      "number": 23,
      "name": "CASTROP Jens",
      "position": "Defensor"
     },
     {
      "number": 17,
      "name": "BAE Junho",
      "position": "Mediocampista"
     },
     {
      "number": 9,
      "name": "CHO Guesung",
      "position": "Delantero"
     },
     {
      "number": 20,
      "name": "YANG Hyunjun",
      "position": "Mediocampista"
     }
    ]
   },
   "away": {
    "formation": "3-4-2-1",
    "coach": "Miroslav Koubek",
    "starting_players": [
     {
      "number": 1,
      "name": "Matej KOVAR",
      "position": "Arquero"
     },
     {
      "number": 6,
      "name": "Stepan CHALOUPEK",
      "position": "Defensor"
     },
     {
      "number": 4,
      "name": "Robin HRANAC",
      "position": "Defensor"
     },
     {
      "number": 7,
      "name": "Ladislav KREJCI",
      "position": "Defensor"
     },
     {
      "number": 5,
      "name": "Vladimir COUFAL",
      "position": "Defensor"
     },
     {
      "number": 22,
      "name": "Tomas SOUCEK",
      "position": "Mediocampista"
     },
     {
      "number": 24,
      "name": "Alexandr SOJKA",
      "position": "Mediocampista"
     },
     {
      "number": 20,
      "name": "Jaroslav ZELENY",
      "position": "Defensor"
     },
     {
      "number": 17,
      "name": "Lukas PROVOD",
      "position": "Mediocampista"
     },
     {
      "number": 15,
      "name": "Pavel SULC",
      "position": "Delantero"
     },
     {
      "number": 10,
      "name": "Patrik Schick",
      "position": "Delantero"
     }
    ],
    "substitutes": [
     {
      "number": 18,
      "name": "Michal SADILEK",
      "position": "Mediocampista"
     },
     {
      "number": 9,
      "name": "Adam HLOZEK",
      "position": "Delantero"
     },
     {
      "number": 19,
      "name": "Tomas CHORY",
      "position": "Delantero"
     },
     {
      "number": 13,
      "name": "Mojmir CHYTIL",
      "position": "Delantero"
     },
     {
      "number": 16,
      "name": "Jindrich STANEK",
      "position": "Arquero"
     },
     {
      "number": 23,
      "name": "Lukas HORNICEK",
      "position": "Arquero"
     },
     {
      "number": 14,
      "name": "David JURASEK",
      "position": "Defensor"
     },
     {
      "number": 2,
      "name": "David Zima",
      "position": "Defensor"
     },
     {
      "number": 3,
      "name": "Tomas HOLES",
      "position": "Defensor"
     },
     {
      "number": 21,
      "name": "David DOUDERA",
      "position": "Defensor"
     },
     {
      "number": 26,
      "name": "Denis VISINSKY",
      "position": "Delantero"
     },
     {
      "number": 25,
      "name": "Hugo SOCHUREK",
      "position": "Mediocampista"
     },
     {
      "number": 12,
      "name": "Lukas CERV",
      "position": "Mediocampista"
     },
     {
      "number": 8,
      "name": "Vladimir DARIDA",
      "position": "Mediocampista"
     },
     {
      "number": 11,
      "name": "Jan KUCHTA",
      "position": "Delantero"
     }
    ]
   }
  },
  "statistics": [
   {
    "group": "Match overview",
    "statistics": [
     {
      "name": "Ball possession",
      "home": "62%",
      "away": "38%",
      "home_value": 62,
      "away_value": 38
     },
     {
      "name": "Expected goals",
      "home": "2.30",
      "away": "0.83",
      "home_value": 2.3,
      "away_value": 0.83
     },
     {
      "name": "Big chances",
      "home": "4",
      "away": "1",
      "home_value": 4,
      "away_value": 1
     },
     {
      "name": "Total shots",
      "home": "15",
      "away": "7",
      "home_value": 15,
      "away_value": 7
     },
     {
      "name": "Goalkeeper saves",
      "home": "3",
      "away": "4",
      "home_value": 3,
      "away_value": 4
     },
     {
      "name": "Corner kicks",
      "home": "4",
      "away": "5",
      "home_value": 4,
      "away_value": 5
     },
     {
      "name": "Fouls",
      "home": "9",
      "away": "16",
      "home_value": 9,
      "away_value": 16
     },
     {
      "name": "Passes",
      "home": "541",
      "away": "327",
      "home_value": 541,
      "away_value": 327
     },
     {
      "name": "Yellow cards",
      "home": "1",
      "away": "0",
      "home_value": 1,
      "away_value": 0
     }
    ]
   },
   {
    "group": "Shots",
    "statistics": [
     {
      "name": "Total shots",
      "home": "15",
      "away": "7",
      "home_value": 15,
      "away_value": 7
     },
     {
      "name": "Shots on target",
      "home": "6",
      "away": "4",
      "home_value": 6,
      "away_value": 4
     },
     {
      "name": "Shots off target",
      "home": "5",
      "away": "3",
      "home_value": 5,
      "away_value": 3
     },
     {
      "name": "Blocked shots",
      "home": "4",
      "away": "1",
      "home_value": 4,
      "away_value": 1
     },
     {
      "name": "Shots inside box",
      "home": "10",
      "away": "5",
      "home_value": 10,
      "away_value": 5
     },
     {
      "name": "Shots outside box",
      "home": "5",
      "away": "2",
      "home_value": 5,
      "away_value": 2
     }
    ]
   },
   {
    "group": "Duels",
    "statistics": [
     {
      "name": "Duels",
      "home": "60%",
      "away": "40%",
      "home_value": 60,
      "away_value": 40
     },
     {
      "name": "Ground duels",
      "home": "29/51 (57%)",
      "away": "22/51 (43%)",
      "home_value": 29,
      "away_value": 22
     },
     {
      "name": "Aerial duels",
      "home": "27/43 (63%)",
      "away": "16/43 (37%)",
      "home_value": 27,
      "away_value": 16
     },
     {
      "name": "Dribbles",
      "home": "8/14 (57%)",
      "away": "4/7 (57%)",
      "home_value": 8,
      "away_value": 4
     }
    ]
   }
  ],
  "chronology": [
   {
    "time": 59,
    "type": "goal",
    "player": {
     "name": "Ladislav Krejčí",
     "number": 7
    },
    "player_in": {
     "name": ""
    },
    "player_out": {
     "name": ""
    },
    "card": ""
   },
   {
    "time": 62,
    "type": "substitution",
    "player": {
     "name": ""
    },
    "player_in": {
     "name": "Hwang Hee-chan",
     "number": 11
    },
    "player_out": {
     "name": "Jae-sung Lee"
    },
    "card": ""
   },
   {
    "time": 64,
    "type": "substitution",
    "player": {
     "name": ""
    },
    "player_in": {
     "name": "Adam Hložek"
    },
    "player_out": {
     "name": "Pavel Šulc"
    },
    "card": ""
   },
   {
    "time": 67,
    "type": "goal",
    "player": {
     "name": "Hwang In-beom",
     "number": 6
    },
    "player_in": {
     "name": ""
    },
    "player_out": {
     "name": ""
    },
    "card": ""
   },
   {
    "time": 69,
    "type": "substitution",
    "player": {
     "name": ""
    },
    "player_in": {
     "name": "Hyeon-gyu Oh"
    },
    "player_out": {
     "name": "Son Heung-min"
    },
    "card": ""
   },
   {
    "time": 80,
    "type": "goal",
    "player": {
     "name": "Hyeon-gyu Oh",
     "number": 18
    },
    "player_in": {
     "name": ""
    },
    "player_out": {
     "name": ""
    },
    "card": ""
   },
   {
    "time": 84,
    "type": "substitution",
    "player": {
     "name": ""
    },
    "player_in": {
     "name": "Mojmír Chytil"
    },
    "player_out": {
     "name": "Alexandr Sojka"
    },
    "card": ""
   },
   {
    "time": 96,
    "type": "card",
    "player": {
     "name": "Gi-Hyuk Lee",
     "number": 3
    },
    "player_in": {
     "name": ""
    },
    "player_out": {
     "name": ""
    },
    "card": "yellow"
   }
  ],
  "highlight": [
   {
    "id": 7517738,
    "title": "South Korea 2 - 1 Czechia",
    "subtitle": "Full Highlights",
    "url": "https://www.youtube.com/watch?v=6k18EJY8zIc",
    "thumbnail_url": "https://i.ytimg.com/vi/6k18EJY8zIc/hqdefault.jpg"
   },
   {
    "id": 7499932,
    "title": "Press Conference",
    "subtitle": "South Korea l Hong Myungbo & Son Heungmin",
    "url": "https://youtu.be/-pZh-gxTBCE",
    "thumbnail_url": "https://i.ytimg.com/vi/-pZh-gxTBCE/hqdefault.jpg"
   },
   {
    "id": 7499933,
    "title": "Press Conference",
    "subtitle": "Czechia I Miroslav Koubek",
    "url": "https://youtu.be/F6C2JEccbkw",
    "thumbnail_url": "https://i.ytimg.com/vi/F6C2JEccbkw/hqdefault.jpg"
   },
   {
    "id": 7500190,
    "title": "South Korea 2 - 1 Czechia",
    "subtitle": "Full Highlights",
    "url": "https://www.youtube.com/watch?v=QcSkKoWG44k",
    "thumbnail_url": "https://i.ytimg.com/vi/QcSkKoWG44k/hqdefault.jpg"
   }
  ]
 },
 "/v1/ranking": [
  {
   "team": {
    "id": "ARG",
    "name": "Argentina",
    "confederation": "CONMEBOL",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ARG",
    "group": "J",
    "world_ranking": 1,
    "appearances": 19,
    "host": false
   },
   "rank": 1,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "ESP",
    "name": "España",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ESP",
    "group": "H",
    "world_ranking": 2,
    "appearances": 17,
    "host": false
   },
   "rank": 2,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "FRA",
    "name": "Francia",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/FRA",
    "group": "I",
    "world_ranking": 3,
    "appearances": 17,
    "host": false
   },
   "rank": 3,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "ENG",
    "name": "Inglaterra",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ENG",
    "group": "L",
    "world_ranking": 4,
    "appearances": 17,
    "host": false
   },
   "rank": 4,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "POR",
    "name": "Portugal",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/POR",
    "group": "K",
    "world_ranking": 5,
    "appearances": 9,
    "host": false
   },
   "rank": 5,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "BRA",
    "name": "Brasil",
    "confederation": "CONMEBOL",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/BRA",
    "group": "C",
    "world_ranking": 6,
    "appearances": 23,
    "host": false
   },
   "rank": 6,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "MAR",
    "name": "Marruecos",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/MAR",
    "group": "C",
    "world_ranking": 7,
    "appearances": 7,
    "host": false
   },
   "rank": 7,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "NED",
    "name": "Países Bajos",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/NED",
    "group": "F",
    "world_ranking": 8,
    "appearances": 12,
    "host": false
   },
   "rank": 8,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "BEL",
    "name": "Bélgica",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/BEL",
    "group": "G",
    "world_ranking": 9,
    "appearances": 15,
    "host": false
   },
   "rank": 9,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "GER",
    "name": "Alemania",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/GER",
    "group": "E",
    "world_ranking": 10,
    "appearances": 21,
    "host": false
   },
   "rank": 10,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "CRO",
    "name": "Croacia",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CRO",
    "group": "L",
    "world_ranking": 11,
    "appearances": 7,
    "host": false
   },
   "rank": 11,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "COL",
    "name": "Colombia",
    "confederation": "CONMEBOL",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/COL",
    "group": "K",
    "world_ranking": 13,
    "appearances": 7,
    "host": false
   },
   "rank": 13,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "MEX",
    "name": "México",
    "confederation": "CONCACAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/MEX",
    "group": "A",
    "world_ranking": 14,
    "appearances": 18,
    "host": true
   },
   "rank": 14,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "SEN",
    "name": "Senegal",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/SEN",
    "group": "I",
    "world_ranking": 15,
    "appearances": 4,
    "host": false
   },
   "rank": 15,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "URU",
    "name": "Uruguay",
    "confederation": "CONMEBOL",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/URU",
    "group": "H",
    "world_ranking": 16,
    "appearances": 15,
    "host": false
   },
   "rank": 16,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "USA",
    "name": "EE. UU.",
    "confederation": "CONCACAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/USA",
    "group": "D",
    "world_ranking": 17,
    "appearances": 12,
    "host": true
   },
   "rank": 17,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "JPN",
    "name": "Japón",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/JPN",
    "group": "F",
    "world_ranking": 18,
    "appearances": 8,
    "host": false
   },
   "rank": 18,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "SUI",
    "name": "Suiza",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/SUI",
    "group": "B",
    "world_ranking": 19,
    "appearances": 13,
    "host": false
   },
   "rank": 19,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "IRN",
    "name": "RI de Irán",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/IRN",
    "group": "G",
    "world_ranking": 20,
    "appearances": 7,
    "host": false
   },
   "rank": 20,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "TUR",
    "name": "Turquía",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/TUR",
    "group": "D",
    "world_ranking": 22,
    "appearances": 3,
    "host": false
   },
   "rank": 22,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "ECU",
    "name": "Ecuador",
    "confederation": "CONMEBOL",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ECU",
    "group": "E",
    "world_ranking": 23,
    "appearances": 5,
    "host": false
   },
   "rank": 23,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "AUT",
    "name": "Austria",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/AUT",
    "group": "J",
    "world_ranking": 24,
    "appearances": 8,
    "host": false
   },
   "rank": 24,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "KOR",
    "name": "República de Corea",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/KOR",
    "group": "A",
    "world_ranking": 25,
    "appearances": 12,
    "host": false
   },
   "rank": 25,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "AUS",
    "name": "Australia",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/AUS",
    "group": "D",
    "world_ranking": 27,
    "appearances": 7,
    "host": false
   },
   "rank": 27,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "ALG",
    "name": "Argelia",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/ALG",
    "group": "J",
    "world_ranking": 28,
    "appearances": 5,
    "host": false
   },
   "rank": 28,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "EGY",
    "name": "Egipto",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/EGY",
    "group": "G",
    "world_ranking": 29,
    "appearances": 4,
    "host": false
   },
   "rank": 29,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "CAN",
    "name": "Canadá",
    "confederation": "CONCACAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CAN",
    "group": "B",
    "world_ranking": 30,
    "appearances": 3,
    "host": true
   },
   "rank": 30,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "NOR",
    "name": "Noruega",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/NOR",
    "group": "I",
    "world_ranking": 31,
    "appearances": 4,
    "host": false
   },
   "rank": 31,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "CIV",
    "name": "Costa de Marfil",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CIV",
    "group": "E",
    "world_ranking": 33,
    "appearances": 4,
    "host": false
   },
   "rank": 33,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "PAN",
    "name": "Panamá",
    "confederation": "CONCACAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/PAN",
    "group": "L",
    "world_ranking": 34,
    "appearances": 2,
    "host": false
   },
   "rank": 34,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "SWE",
    "name": "Suecia",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/SWE",
    "group": "F",
    "world_ranking": 38,
    "appearances": 13,
    "host": false
   },
   "rank": 38,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "CZE",
    "name": "Chequia",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CZE",
    "group": "A",
    "world_ranking": 40,
    "appearances": 10,
    "host": false
   },
   "rank": 40,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "PAR",
    "name": "Paraguay",
    "confederation": "CONMEBOL",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/PAR",
    "group": "D",
    "world_ranking": 41,
    "appearances": 9,
    "host": false
   },
   "rank": 41,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "SCO",
    "name": "Escocia",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/SCO",
    "group": "C",
    "world_ranking": 42,
    "appearances": 9,
    "host": false
   },
   "rank": 42,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "TUN",
    "name": "Túnez",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/TUN",
    "group": "F",
    "world_ranking": 45,
    "appearances": 7,
    "host": false
   },
   "rank": 45,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "COD",
    "name": "RD Congo",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/COD",
    "group": "K",
    "world_ranking": 46,
    "appearances": 2,
    "host": false
   },
   "rank": 46,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "UZB",
    "name": "Uzbekistán",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/UZB",
    "group": "K",
    "world_ranking": 50,
    "appearances": 1,
    "host": false
   },
   "rank": 50,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "QAT",
    "name": "Catar",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/QAT",
    "group": "B",
    "world_ranking": 56,
    "appearances": 2,
    "host": false
   },
   "rank": 56,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "IRQ",
    "name": "Irak",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/IRQ",
    "group": "I",
    "world_ranking": 57,
    "appearances": 2,
    "host": false
   },
   "rank": 57,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "RSA",
    "name": "Sudáfrica",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/RSA",
    "group": "A",
    "world_ranking": 60,
    "appearances": 4,
    "host": false
   },
   "rank": 60,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "KSA",
    "name": "Arabia Saudí",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/KSA",
    "group": "H",
    "world_ranking": 61,
    "appearances": 7,
    "host": false
   },
   "rank": 61,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "JOR",
    "name": "Jordania",
    "confederation": "AFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/JOR",
    "group": "J",
    "world_ranking": 63,
    "appearances": 1,
    "host": false
   },
   "rank": 63,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "BIH",
    "name": "Bosnia y Herzegovina",
    "confederation": "UEFA",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/BIH",
    "group": "B",
    "world_ranking": 64,
    "appearances": 2,
    "host": false
   },
   "rank": 64,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "CPV",
    "name": "Islas de Cabo Verde",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CPV",
    "group": "H",
    "world_ranking": 67,
    "appearances": 1,
    "host": false
   },
   "rank": 67,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "GHA",
    "name": "Ghana",
    "confederation": "CAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/GHA",
    "group": "L",
    "world_ranking": 72,
    "appearances": 5,
    "host": false
   },
   "rank": 72,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "CUW",
    "name": "Curazao",
    "confederation": "CONCACAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/CUW",
    "group": "E",
    "world_ranking": 82,
    "appearances": 1,
    "host": false
   },
   "rank": 82,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "HAI",
    "name": "Haití",
    "confederation": "CONCACAF",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/HAI",
    "group": "C",
    "world_ranking": 83,
    "appearances": 2,
    "host": false
   },
   "rank": 83,
   "previous_rank": null,
   "points": null
  },
  {
   "team": {
    "id": "NZL",
    "name": "Nueva Zelanda",
    "confederation": "OFC",
    "flag_url": "https://api.fifa.com/api/v3/picture/flags-sq-5/NZL",
    "group": "G",
    "world_ranking": 85,
    "appearances": 3,
    "host": false
   },
   "rank": 85,
   "previous_rank": null,
   "points": null
  }
 ]
};
