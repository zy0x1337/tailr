// Dog breed data with complete information for matching
const dogBreeds = [
  {
    id: 1,
    name: "Deutscher Schäferhund",
    description: "Klassischer Arbeitshund mit starkem Schutzinstinkt.",
    origin: "Deutschland",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 55, max: 65, avg: 60.0, category: "Groß"},
    weight_info: {min: 22, max: 40},
    life_expectancy: "9-13 Jahre",
    temperament: ["Intelligent", "Loyal", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Vielfältig einsetzbar als Dienst-, Rettungs- oder Familienhund. Braucht viel Bewegung und geistige Auslastung.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 2,
    name: "Belgischer Schäferhund (Malinois)",
    description: "Hochleistungs-Schäferhund für anspruchsvolle Aufgaben.",
    origin: "Belgien",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 60, max: 66, avg: 63.0, category: "Groß"},
    weight_info: {min: 25, max: 30},
    life_expectancy: "12-14 Jahre",
    temperament: ["Wachsam", "Energisch", "Arbeitswillig"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Wird weltweit als Polizei- und Schutzhund eingesetzt. Benötigt erfahrene Führung.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 1,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 3,
    name: "Border Collie",
    description: "Höchst intelligenter Hütehund mit unermüdlichem Arbeitseifer.",
    origin: "Großbritannien",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 46, max: 56, avg: 51.0, category: "Mittel"},
    weight_info: {min: 14, max: 20},
    life_expectancy: "12-15 Jahre",
    temperament: ["Energisch", "Fokussiert", "Lernfähig"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Benötigt täglich mehrstündige geistige und körperliche Beschäftigung. Ideal für Hundesport.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 1,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 4,
    name: "Australian Shepherd",
    description: "Agiler Hütehund mit auffälligem Fell.",
    origin: "USA",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 46, max: 58, avg: 52.0, category: "Mittel"},
    weight_info: {min: 18, max: 32},
    life_expectancy: "12-15 Jahre",
    temperament: ["Aktiv", "Intelligent", "Aufmerksam"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Arbeitsfreudiger Hund für aktive Besitzer. Braucht viel Platz und Aufgaben.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 1,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 5,
    name: "Altdeutscher Schäferhund",
    description: "Langstockhaariger, robuster Schäferhund.",
    origin: "Deutschland",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 55, max: 65, avg: 60.0, category: "Groß"},
    weight_info: {min: 22, max: 40},
    life_expectancy: "10-14 Jahre",
    temperament: ["Treue", "Arbeitsfreude", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Etwas ursprünglicher als der moderne Deutsche Schäferhund. Gilt als robust und familienfreundlich.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 6,
    name: "Australian Cattle Dog",
    description: "Robuster, ausdauernder Treibhund aus Australien.",
    origin: "Australien",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 43, max: 51, avg: 47.0, category: "Mittel"},
    weight_info: {min: 16, max: 23},
    life_expectancy: "12-15 Jahre",
    temperament: ["Arbeitsfreudig", "Mutig", "Loyal"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Sehr aktiv, benötigt viel Bewegung und Aufgaben. Loyal, wachsam, sportlich.",
    activity_level: 5,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 7,
    name: "Shetland Sheepdog (Sheltie)",
    description: "Kleiner, langhaariger Hütehund, sehr anhänglich.",
    origin: "Großbritannien",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 33, max: 41, avg: 37.0, category: "Klein"},
    weight_info: {min: 6, max: 12},
    life_expectancy: "12-14 Jahre",
    temperament: ["Anhänglich", "Intelligent", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Shelties sind freundlich, verspielt und wollen gefallen. Sie eignen sich gut für Familien und Hundesport.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 8,
    name: "Bearded Collie",
    description: "Langhaariger, lebhafter Hütehund.",
    origin: "Großbritannien",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 51, max: 56, avg: 53.5, category: "Mittel"},
    weight_info: {min: 18, max: 27},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Freundlich", "Arbeitsfreudig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bearded Collies sind freundlich, verspielt und brauchen viel Bewegung. Ihr langes Fell erfordert regelmäßige Pflege.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 5,
    grooming_needs: 3
  }
,
  {
    id: 9,
    name: "Briard",
    description: "Großer, langhaariger französischer Hütehund.",
    origin: "Frankreich",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 56, max: 68, avg: 62.0, category: "Groß"},
    weight_info: {min: 30, max: 40},
    life_expectancy: "10-12 Jahre",
    temperament: ["Intelligent", "Wachsam", "Treu"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Der Briard ist ein sehr treuer und wachsamer Familienhund, der viel Beschäftigung und Fellpflege braucht.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 3
  }
,
  {
    id: 10,
    name: "Beauceron",
    description: "Kräftiger, wachsamer französischer Schäferhund.",
    origin: "Frankreich",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 61, max: 70, avg: 65.5, category: "Groß"},
    weight_info: {min: 30, max: 50},
    life_expectancy: "10-12 Jahre",
    temperament: ["Wachsam", "Mutig", "Arbeitsfreudig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Der Beauceron ist ein vielseitiger, sehr wachsamer und kräftiger Hütehund.",
    activity_level: 5,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 11,
    name: "Berger de Picardie",
    description: "Ursprünglicher, robuster französischer Schäferhund.",
    origin: "Frankreich",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 55, max: 65, avg: 60.0, category: "Groß"},
    weight_info: {min: 23, max: 32},
    life_expectancy: "12-13 Jahre",
    temperament: ["Robust", "Intelligent", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Seltene, robuste Rasse mit ursprünglichem Charakter. Braucht viel Bewegung.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 12,
    name: "Polski Owczarek Nizinny",
    description: "Polnischer Niederungshütehund, mittelgroß, langhaarig.",
    origin: "Polen",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 42, max: 50, avg: 46.0, category: "Mittel"},
    weight_info: {min: 14, max: 23},
    life_expectancy: "12-14 Jahre",
    temperament: ["Intelligent", "Lebhaft", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Lebhafter, intelligenter Hütehund, braucht viel Beschäftigung und Fellpflege.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 3
  }
,
  {
    id: 13,
    name: "Komondor",
    description: "Ungarischer Herdenschutzhund mit auffälligem Zottelfell.",
    origin: "Ungarn",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 65, max: 80, avg: 72.5, category: "Groß"},
    weight_info: {min: 40, max: 60},
    life_expectancy: "10-12 Jahre",
    temperament: ["Wachsam", "Unabhängig", "Schützend"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Sehr großer, eigenständiger Herdenschutzhund. Benötigt sehr viel Platz und konsequente Führung.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 1,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 14,
    name: "Puli",
    description: "Ungarischer Hütehund mit zottigem Fell.",
    origin: "Ungarn",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 36, max: 45, avg: 40.5, category: "Mittel"},
    weight_info: {min: 10, max: 15},
    life_expectancy: "12-16 Jahre",
    temperament: ["Lebhaft", "Intelligent", "Wachsam"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Sehr bewegungsfreudig und intelligent. Das Fell benötigt spezielle Pflege.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 1,
    exercise_needs: 4,
    grooming_needs: 3
  }
,
  {
    id: 15,
    name: "Tatrahund (Polnischer Tatra-Schäferhund)",
    description: "Großer, weißer Herdenschutzhund aus Polen.",
    origin: "Polen",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 60, max: 70, avg: 65.0, category: "Groß"},
    weight_info: {min: 35, max: 60},
    life_expectancy: "10-12 Jahre",
    temperament: ["Wachsam", "Ruhig", "Unabhängig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Eigenständiger Herdenschutzhund, braucht viel Platz und Aufgaben.",
    activity_level: 2,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 16,
    name: "Maremmen-Abruzzen-Schäferhund",
    description: "Großer, weißer Herdenschutzhund aus Italien.",
    origin: "Italien",
    category: "Schäferhunde & Treibhunde",
    size_info: {min: 60, max: 73, avg: 66.5, category: "Groß"},
    weight_info: {min: 30, max: 45},
    life_expectancy: "11-13 Jahre",
    temperament: ["Wachsam", "Unabhängig", "Schützend"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Eigenständiger, robuster Herdenschutzhund. Braucht viel Platz und Aufgaben.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 17,
    name: "Rottweiler",
    description: "Kraftvoller Wachhund mit ausgeprägtem Schutztrieb.",
    origin: "Deutschland",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 56, max: 68, avg: 62.0, category: "Groß"},
    weight_info: {min: 35, max: 60},
    life_expectancy: "8-10 Jahre",
    temperament: ["Selbstsicher", "Ruhig", "Loyal"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Braucht konsequente Erziehung und Sozialisierung. Ausgezeichneter Schutzhund.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 18,
    name: "Dobermann",
    description: "Eleganter, athletischer Diensthund.",
    origin: "Deutschland",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 63, max: 72, avg: 67.5, category: "Groß"},
    weight_info: {min: 32, max: 45},
    life_expectancy: "10-13 Jahre",
    temperament: ["Wachsam", "Intelligent", "Furchtlos"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Hochintelligent und lernfreudig. Braucht enge Bindung an seine Familie.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 19,
    name: "Boxer",
    description: "Kraftvoller, verspielter Familienhund.",
    origin: "Deutschland",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 53, max: 63, avg: 58.0, category: "Mittel"},
    weight_info: {min: 25, max: 32},
    life_expectancy: "10-12 Jahre",
    temperament: ["Verspielt", "Geduldig", "Energisch"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Kinderlieb und verspielt. Neigt zu Hitzeempfindlichkeit und Herzproblemen.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 20,
    name: "Berner Sennenhund",
    description: "Dreifarbiger, freundlicher Bauernhund.",
    origin: "Schweiz",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 58, max: 70, avg: 64.0, category: "Groß"},
    weight_info: {min: 35, max: 55},
    life_expectancy: "7-10 Jahre",
    temperament: ["Gelassen", "Freundlich", "Treue"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Typischer Familienhund. Leider kurze Lebenserwartung durch Erbkrankheiten.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 21,
    name: "Cane Corso",
    description: "Italienischer Molosser, kräftig und wachsam.",
    origin: "Italien",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 60, max: 68, avg: 64.0, category: "Groß"},
    weight_info: {min: 40, max: 50},
    life_expectancy: "10-12 Jahre",
    temperament: ["Beschützend", "Selbstbewusst", "Treu"],
    care_level: "Erfahrene Halter",
    care_level_numeric: 4,
    detailed_info: "Der Cane Corso ist ein imposanter, loyaler Begleiter mit starkem Schutztrieb. Er braucht eine konsequente, erfahrene Führung und viel Bewegung.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 1,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 22,
    name: "Deutscher Pinscher",
    description: "Mittelgroßer, eleganter und lebhafter Begleiter.",
    origin: "Deutschland",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 45, max: 50, avg: 47.5, category: "Mittel"},
    weight_info: {min: 14, max: 20},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Wachsam", "Intelligent"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Deutsche Pinscher sind lebhaft, wachsam und familienfreundlich. Sie brauchen viel Bewegung und Beschäftigung.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 23,
    name: "Neufundländer",
    description: "Sehr großer, freundlicher Wasserhund.",
    origin: "Kanada",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 66, max: 71, avg: 68.5, category: "Groß"},
    weight_info: {min: 50, max: 70},
    life_expectancy: "8-10 Jahre",
    temperament: ["Freundlich", "Sanft", "Familienbezogen"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Neufundländer sind sehr sanft, freundlich und lieben Wasser. Sie brauchen viel Platz und regelmäßige Fellpflege.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 4
  }
,
  {
    id: 24,
    name: "Großer Schweizer Sennenhund",
    description: "Großer, kräftiger Bauernhund aus der Schweiz.",
    origin: "Schweiz",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 60, max: 72, avg: 66.0, category: "Groß"},
    weight_info: {min: 35, max: 60},
    life_expectancy: "8-11 Jahre",
    temperament: ["Ruhig", "Treu", "Wachsam"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Große Schweizer Sennenhunde sind ruhig, freundlich und kinderlieb. Sie brauchen viel Platz und engen Familienanschluss.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 25,
    name: "Appenzeller Sennenhund",
    description: "Lebhafter, mittelgroßer Schweizer Sennenhund.",
    origin: "Schweiz",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 48, max: 58, avg: 53.0, category: "Mittel"},
    weight_info: {min: 22, max: 32},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Wachsam", "Treue"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Der Appenzeller ist ein aktiver, wachsamer Bauernhund mit ausgeprägtem Schutztrieb.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 26,
    name: "Entlebucher Sennenhund",
    description: "Kleinster Schweizer Sennenhund, sehr bewegungsfreudig.",
    origin: "Schweiz",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 42, max: 50, avg: 46.0, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "11-15 Jahre",
    temperament: ["Lebhaft", "Freundlich", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Der Entlebucher ist ein aktiver, freundlicher und wachsamer Familienhund.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 27,
    name: "Landseer",
    description: "Großer, schwarz-weißer Wasserhund.",
    origin: "Kanada/Europa",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 67, max: 80, avg: 73.5, category: "Groß"},
    weight_info: {min: 50, max: 70},
    life_expectancy: "10-12 Jahre",
    temperament: ["Freundlich", "Sanft", "Familienbezogen"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Landseer sind eng mit dem Neufundländer verwandt, sehr sanft und kinderlieb.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 28,
    name: "Bernhardiner",
    description: "Sehr großer, kräftiger Rettungshund aus den Alpen.",
    origin: "Schweiz",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 65, max: 90, avg: 77.5, category: "Groß"},
    weight_info: {min: 60, max: 100},
    life_expectancy: "8-10 Jahre",
    temperament: ["Freundlich", "Ruhig", "Treu"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bernhardiner sind berühmte Rettungshunde, sehr freundlich und familienbezogen.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 29,
    name: "Bullmastiff",
    description: "Großer, kräftiger Wachhund.",
    origin: "Großbritannien",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 61, max: 69, avg: 65.0, category: "Groß"},
    weight_info: {min: 41, max: 59},
    life_expectancy: "8-10 Jahre",
    temperament: ["Wachsam", "Ruhig", "Treu"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bullmastiffs sind ruhige, wachsame Hunde mit ausgeprägtem Schutztrieb.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 30,
    name: "Mastiff",
    description: "Sehr großer, uralter englischer Molosser.",
    origin: "Großbritannien",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 70, max: 76, avg: 73.0, category: "Groß"},
    weight_info: {min: 70, max: 100},
    life_expectancy: "8-10 Jahre",
    temperament: ["Ruhig", "Treu", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Mastiffs sind sehr große, ruhige und freundliche Hunde mit starkem Schutztrieb.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 31,
    name: "Pyrenäenberghund",
    description: "Sehr großer, weißer Herdenschutzhund aus den Pyrenäen.",
    origin: "Frankreich",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 65, max: 80, avg: 72.5, category: "Groß"},
    weight_info: {min: 40, max: 60},
    life_expectancy: "10-12 Jahre",
    temperament: ["Ruhig", "Unabhängig", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Sehr großer, eigenständiger Herdenschutzhund. Braucht viel Platz und Aufgaben.",
    activity_level: 2,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 32,
    name: "Leonberger",
    description: "Sehr großer, langhaariger Familienhund.",
    origin: "Deutschland",
    category: "Pinscher, Schnauzer, Molosser, Sennenhunde",
    size_info: {min: 65, max: 80, avg: 72.5, category: "Groß"},
    weight_info: {min: 45, max: 80},
    life_expectancy: "8-10 Jahre",
    temperament: ["Freundlich", "Sanft", "Familienbezogen"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Leonberger sind sehr große, freundliche Familienhunde mit viel Fell.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 33,
    name: "West Highland White Terrier",
    description: "Kleiner, weißer Terrier, lebhaft und freundlich.",
    origin: "Schottland",
    category: "Terrier",
    size_info: {min: 25, max: 28, avg: 26.5, category: "Klein"},
    weight_info: {min: 7, max: 10},
    life_expectancy: "12-16 Jahre",
    temperament: ["Selbständig", "Lebhaft", "Treue"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Robuster kleiner Hund mit typischem Terrier-Charakter.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 34,
    name: "Foxterrier",
    description: "Kleiner, mutiger Jagdhund mit kurzem oder drahtigem Fell.",
    origin: "Großbritannien",
    category: "Terrier",
    size_info: {min: 35, max: 39, avg: 37.0, category: "Klein"},
    weight_info: {min: 7, max: 8},
    life_expectancy: "12-15 Jahre",
    temperament: ["Mutig", "Lebhaft", "Intelligent"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Foxterrier sind sehr aktiv, verspielt und brauchen viel Auslauf. Sie sind mutig und eignen sich gut für sportliche Halter.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 35,
    name: "Bullterrier",
    description: "Charakterstarker, muskulöser Terrier mit unverwechselbarem Kopf.",
    origin: "Großbritannien",
    category: "Terrier",
    size_info: {min: 45, max: 55, avg: 50.0, category: "Mittel"},
    weight_info: {min: 20, max: 35},
    life_expectancy: "10-14 Jahre",
    temperament: ["Selbstbewusst", "Verspielt", "Treu"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bullterrier sind freundlich, verspielt und brauchen eine konsequente Erziehung. Sie sind sehr menschenbezogen.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 36,
    name: "Yorkshire Terrier",
    description: "Kleiner Hund mit seidigem, langem Fell.",
    origin: "England",
    category: "Terrier",
    size_info: {min: 18, max: 23, avg: 20.5, category: "Sehr klein"},
    weight_info: {min: 2, max: 3},
    life_expectancy: "13-16 Jahre",
    temperament: ["Selbstbewusst", "Lebhaft", "Anhänglich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Pflegeintensives Fell. Trotz Größe sehr mutig und wachsam.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 4
  }
,
  {
    id: 37,
    name: "Jack Russell Terrier",
    description: "Kleiner, unermüdlicher Jagdterrier.",
    origin: "England",
    category: "Terrier",
    size_info: {min: 25, max: 30, avg: 27.5, category: "Klein"},
    weight_info: {min: 5, max: 8},
    life_expectancy: "13-16 Jahre",
    temperament: ["Energisch", "Mutig", "Intelligent"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Braucht extrem viel Beschäftigung. Ursprünglich für die Fuchsjagd gezüchtet.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 1,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 38,
    name: "Staffordshire Bullterrier",
    description: "Kleiner, muskulöser Terrier mit freundlichem Wesen.",
    origin: "Großbritannien",
    category: "Terrier",
    size_info: {min: 35, max: 40, avg: 37.5, category: "Klein"},
    weight_info: {min: 11, max: 17},
    life_expectancy: "12-14 Jahre",
    temperament: ["Freundlich", "Mutig", "Verspielt"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Staffordshire Bullterrier sind sehr menschenbezogen, verspielt und freundlich.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 39,
    name: "Airedale Terrier",
    description: "Größter Terrier, vielseitig und intelligent.",
    origin: "Großbritannien",
    category: "Terrier",
    size_info: {min: 56, max: 61, avg: 58.5, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "10-13 Jahre",
    temperament: ["Intelligent", "Mutig", "Lebhaft"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Airedale Terrier sind vielseitige, intelligente und aktive Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 40,
    name: "Cairn Terrier",
    description: "Kleiner, robuster Terrier aus Schottland.",
    origin: "Schottland",
    category: "Terrier",
    size_info: {min: 28, max: 31, avg: 29.5, category: "Klein"},
    weight_info: {min: 6, max: 7},
    life_expectancy: "13-15 Jahre",
    temperament: ["Lebhaft", "Mutig", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Cairn Terrier sind robuste, freundliche und lebhafte kleine Hunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 41,
    name: "Norfolk Terrier",
    description: "Kleiner, fröhlicher Terrier mit Hängeohren.",
    origin: "England",
    category: "Terrier",
    size_info: {min: 23, max: 25, avg: 24.0, category: "Sehr klein"},
    weight_info: {min: 5, max: 6},
    life_expectancy: "12-15 Jahre",
    temperament: ["Fröhlich", "Mutig", "Lebhaft"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Norfolk Terrier sind sehr kleine, freundliche und mutige Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 42,
    name: "Norwich Terrier",
    description: "Kleiner, freundlicher Terrier mit Stehohren.",
    origin: "England",
    category: "Terrier",
    size_info: {min: 24, max: 26, avg: 25.0, category: "Klein"},
    weight_info: {min: 5, max: 6},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Mutig", "Lebhaft"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Norwich Terrier sind kleine, lebhafte und freundliche Begleiter.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 43,
    name: "Welsh Terrier",
    description: "Kleiner, drahtiger Terrier aus Wales.",
    origin: "Wales",
    category: "Terrier",
    size_info: {min: 39, max: 40, avg: 39.5, category: "Klein"},
    weight_info: {min: 9, max: 10},
    life_expectancy: "12-15 Jahre",
    temperament: ["Lebhaft", "Mutig", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Welsh Terrier sind freundliche, mutige und lebhafte Terrier.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 44,
    name: "Irish Terrier",
    description: "Mittelgroßer, eleganter Terrier aus Irland.",
    origin: "Irland",
    category: "Terrier",
    size_info: {min: 45, max: 48, avg: 46.5, category: "Mittel"},
    weight_info: {min: 11, max: 13},
    life_expectancy: "12-15 Jahre",
    temperament: ["Mutig", "Intelligent", "Lebhaft"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Irish Terrier sind sehr mutige, intelligente und freundliche Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 45,
    name: "Scottish Terrier",
    description: "Kleiner, drahtiger Terrier mit markantem Bart.",
    origin: "Schottland",
    category: "Terrier",
    size_info: {min: 25, max: 28, avg: 26.5, category: "Klein"},
    weight_info: {min: 8, max: 5},
    life_expectancy: "12-15 Jahre",
    temperament: ["Stur", "Mutig", "Treue"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Scottish Terrier sind stur, mutig und sehr charakterstark.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 2,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 46,
    name: "Bedlington Terrier",
    description: "Lammähnlicher, eleganter Terrier.",
    origin: "England",
    category: "Terrier",
    size_info: {min: 38, max: 44, avg: 41.0, category: "Mittel"},
    weight_info: {min: 8, max: 10},
    life_expectancy: "12-16 Jahre",
    temperament: ["Sanft", "Lebhaft", "Mutig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bedlington Terrier sind sanfte, elegante und freundliche Terrier.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 47,
    name: "Dandie Dinmont Terrier",
    description: "Kleiner, langgestreckter Terrier mit Haarschopf.",
    origin: "Schottland",
    category: "Terrier",
    size_info: {min: 20, max: 28, avg: 24.0, category: "Sehr klein"},
    weight_info: {min: 8, max: 11},
    life_expectancy: "12-15 Jahre",
    temperament: ["Sanft", "Mutig", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Dandie Dinmont Terrier sind sanfte, freundliche und mutige Terrier.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 48,
    name: "Sealyham Terrier",
    description: "Kleiner, weißer Terrier mit Bart.",
    origin: "Wales",
    category: "Terrier",
    size_info: {min: 25, max: 31, avg: 28.0, category: "Klein"},
    weight_info: {min: 8, max: 9},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Mutig", "Lebhaft"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Sealyham Terrier sind freundliche, mutige und lebhafte Terrier.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 49,
    name: "Dackel (Standard)",
    description: "Langgestreckter Jagdhund mit kurzen Beinen.",
    origin: "Deutschland",
    category: "Dachshunde",
    size_info: {min: 20, max: 27, avg: 23.5, category: "Sehr klein"},
    weight_info: {min: 7, max: 9},
    life_expectancy: "12-16 Jahre",
    temperament: ["Mutig", "Ausdauernd", "Eigensinnig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Spezialist für die Baujagd. Neigt zu Rückenproblemen (Dackellähme).",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 3,
    beginner_friendly: 2,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 50,
    name: "Zwergdackel",
    description: "Kleinere Variante des Dackels.",
    origin: "Deutschland",
    category: "Dachshunde",
    size_info: {min: 15, max: 21, avg: 18.0, category: "Sehr klein"},
    weight_info: {min: 3, max: 5},
    life_expectancy: "12-16 Jahre",
    temperament: ["Lebhaft", "Wachsam", "Treue"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Wie Standard-Dackel, aber kompakter. Ebenfalls rückenanfällig.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: true,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 51,
    name: "Kaninchen-Dackel",
    description: "Sehr kleiner, wendiger Dackel für die Baujagd.",
    origin: "Deutschland",
    category: "Dachshunde",
    size_info: {min: 12, max: 15, avg: 13.5, category: "Sehr klein"},
    weight_info: {min: 2, max: 4},
    life_expectancy: "12-16 Jahre",
    temperament: ["Mutig", "Stur", "Freundlich"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Kaninchen-Dackel sind sehr klein, aber mutig und aktiv. Sie benötigen viel Beschäftigung und sind für Familien mit Kindern geeignet.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 52,
    name: "Deutscher Spitz",
    description: "Typischer deutscher Spitz, wachsam und freundlich.",
    origin: "Deutschland",
    category: "Spitze & Hunde vom Urtyp",
    size_info: {min: 24, max: 49, avg: 36.5, category: "Klein"},
    weight_info: {min: 7, max: 18},
    life_expectancy: "13-16 Jahre",
    temperament: ["Wachsam", "Lebhaft", "Treue"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Der Deutsche Spitz ist sehr wachsam, anhänglich und eignet sich als Familien- und Begleithund. Es gibt ihn in verschiedenen Größen.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 53,
    name: "Siberian Husky",
    description: "Bekannter Schlittenhund, freundlich und ausdauernd.",
    origin: "Russland",
    category: "Spitze & Hunde vom Urtyp",
    size_info: {min: 50, max: 60, avg: 55.0, category: "Mittel"},
    weight_info: {min: 16, max: 27},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Ausdauernd", "Unabhängig"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Siberian Huskys sind freundlich, ausdauernd und brauchen sehr viel Bewegung. Sie sind sozial, aber auch eigenständig.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 54,
    name: "Samojede",
    description: "Weißer, freundlicher nordischer Spitz.",
    origin: "Russland",
    category: "Spitze & Hunde vom Urtyp",
    size_info: {min: 50, max: 60, avg: 55.0, category: "Mittel"},
    weight_info: {min: 16, max: 30},
    life_expectancy: "12-14 Jahre",
    temperament: ["Freundlich", "Sanft", "Lebhaft"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Samojeden sind freundlich, verspielt und sehr menschenbezogen. Ihr Fell braucht regelmäßige Pflege.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 3
  }
,
  {
    id: 55,
    name: "Akita Inu",
    description: "Großer, stolzer japanischer Spitz.",
    origin: "Japan",
    category: "Spitze & Hunde vom Urtyp",
    size_info: {min: 58, max: 70, avg: 64.0, category: "Groß"},
    weight_info: {min: 30, max: 45},
    life_expectancy: "10-13 Jahre",
    temperament: ["Stolz", "Unabhängig", "Ruhig"],
    care_level: "Erfahrene Halter",
    care_level_numeric: 4,
    detailed_info: "Akita Inus sind eigenständig, ruhig und wachsam. Sie benötigen eine konsequente Erziehung und sind für erfahrene Halter geeignet.",
    activity_level: 2,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 56,
    name: "Alaskan Malamute",
    description: "Sehr kräftiger, großer Schlittenhund.",
    origin: "USA",
    category: "Spitze & Hunde vom Urtyp",
    size_info: {min: 58, max: 71, avg: 64.5, category: "Groß"},
    weight_info: {min: 34, max: 43},
    life_expectancy: "10-14 Jahre",
    temperament: ["Kräftig", "Freundlich", "Unabhängig"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Alaskan Malamutes sind kräftig, freundlich und brauchen viel Bewegung. Sie sind für erfahrene Halter geeignet.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 57,
    name: "Shiba Inu",
    description: "Kleiner, unabhängiger Spitz aus Japan.",
    origin: "Japan",
    category: "Spitze & Hunde vom Urtyp",
    size_info: {min: 35, max: 43, avg: 39.0, category: "Klein"},
    weight_info: {min: 8, max: 11},
    life_expectancy: "12-15 Jahre",
    temperament: ["Unabhängig", "Intelligent", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Shiba Inus sind sehr eigenständig, intelligent und wachsam. Sie brauchen eine konsequente Erziehung.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 58,
    name: "Beagle",
    description: "Kleiner Jagdhund mit ausgezeichnetem Geruchssinn.",
    origin: "England",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 33, max: 41, avg: 37.0, category: "Klein"},
    weight_info: {min: 10, max: 18},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Neugierig", "Stur"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Starker Jagdtrieb. Braucht sichere Umgebung und viel Nasenarbeit.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 59,
    name: "Basset Hound",
    description: "Laufhund mit kurzen Beinen und langen Ohren.",
    origin: "Frankreich",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 33, max: 38, avg: 35.5, category: "Klein"},
    weight_info: {min: 18, max: 30},
    life_expectancy: "10-12 Jahre",
    temperament: ["Freundlich", "Ruhig", "Stur"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Basset Hounds sind freundlich, ruhig und kinderlieb. Sie sind eher gemütlich, brauchen aber regelmäßige Bewegung.",
    activity_level: 2,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 5,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 60,
    name: "Deutsche Bracke",
    description: "Deutscher Laufhund, passionierter Jäger.",
    origin: "Deutschland",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 40, max: 53, avg: 46.5, category: "Mittel"},
    weight_info: {min: 16, max: 20},
    life_expectancy: "10-12 Jahre",
    temperament: ["Jagdtrieb", "Ausdauernd", "Freundlich"],
    care_level: "Erfahrene Halter",
    care_level_numeric: 4,
    detailed_info: "Die Deutsche Bracke ist ein passionierter Jagdhund mit viel Ausdauer. Sie braucht viel Bewegung und jagdliche Führung.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 2,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 61,
    name: "Petit Basset Griffon Vendéen",
    description: "Kleiner, rauhaariger französischer Laufhund.",
    origin: "Frankreich",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 34, max: 38, avg: 36.0, category: "Klein"},
    weight_info: {min: 15, max: 20},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Fröhlich", "Jagdtrieb"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Petit Basset Griffon Vendéen sind lebhafte, freundliche und jagdlich ambitionierte Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 62,
    name: "Grand Basset Griffon Vendéen",
    description: "Größerer, rauhaariger französischer Laufhund.",
    origin: "Frankreich",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 40, max: 44, avg: 42.0, category: "Mittel"},
    weight_info: {min: 18, max: 20},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Fröhlich", "Jagdtrieb"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Grand Basset Griffon Vendéen sind lebhafte, freundliche und jagdlich ambitionierte Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 63,
    name: "Bloodhound",
    description: "Sehr großer, berühmter Schweißhund.",
    origin: "Belgien/Frankreich",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 58, max: 69, avg: 63.5, category: "Groß"},
    weight_info: {min: 36, max: 50},
    life_expectancy: "10-12 Jahre",
    temperament: ["Ruhig", "Freundlich", "Jagdtrieb"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bloodhounds sind berühmt für ihren Geruchssinn und werden als Suchhunde eingesetzt.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 2,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 64,
    name: "Bayerischer Gebirgsschweißhund",
    description: "Spezialisierter deutscher Schweißhund.",
    origin: "Deutschland",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 47, max: 52, avg: 49.5, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "10-14 Jahre",
    temperament: ["Ruhig", "Jagdtrieb", "Ausdauernd"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bayerische Gebirgsschweißhunde sind ruhige, ausdauernde und jagdlich ambitionierte Hunde.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 2,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 65,
    name: "Hannoverscher Schweißhund",
    description: "Alter, spezialisierter deutscher Schweißhund.",
    origin: "Deutschland",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 50, max: 55, avg: 52.5, category: "Mittel"},
    weight_info: {min: 25, max: 40},
    life_expectancy: "10-14 Jahre",
    temperament: ["Ruhig", "Jagdtrieb", "Ausdauernd"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Hannoversche Schweißhunde sind ruhige, ausdauernde und jagdlich ambitionierte Hunde.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 2,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 66,
    name: "Foxhound",
    description: "Englischer Laufhund, für die Fuchsjagd gezüchtet.",
    origin: "England",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 58, max: 64, avg: 61.0, category: "Groß"},
    weight_info: {min: 29, max: 34},
    life_expectancy: "10-13 Jahre",
    temperament: ["Lebhaft", "Jagdtrieb", "Sozial"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Foxhounds sind sehr soziale, ausdauernde und jagdlich ambitionierte Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 67,
    name: "Harrier",
    description: "Mittelgroßer, englischer Laufhund.",
    origin: "England",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 48, max: 55, avg: 51.5, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "12-15 Jahre",
    temperament: ["Lebhaft", "Jagdtrieb", "Sozial"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Harrier sind sehr soziale, ausdauernde und jagdlich ambitionierte Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 68,
    name: "Otterhound",
    description: "Großer, rauhaariger englischer Laufhund.",
    origin: "England",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 61, max: 69, avg: 65.0, category: "Groß"},
    weight_info: {min: 30, max: 52},
    life_expectancy: "10-13 Jahre",
    temperament: ["Freundlich", "Jagdtrieb", "Sozial"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Otterhounds sind freundliche, ausdauernde und jagdlich ambitionierte Hunde.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 69,
    name: "Plott Hound",
    description: "Amerikanischer Laufhund, vielseitig einsetzbar.",
    origin: "USA",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 50, max: 71, avg: 60.5, category: "Groß"},
    weight_info: {min: 18, max: 27},
    life_expectancy: "12-14 Jahre",
    temperament: ["Jagdtrieb", "Sozial", "Lebhaft"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Plott Hounds sind vielseitige, ausdauernde und jagdlich ambitionierte Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 70,
    name: "Basset Fauve de Bretagne",
    description: "Kleiner, rauhaariger französischer Laufhund.",
    origin: "Frankreich",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 32, max: 38, avg: 35.0, category: "Klein"},
    weight_info: {min: 16, max: 18},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Jagdtrieb", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Basset Fauve de Bretagne sind lebhafte, freundliche und jagdlich ambitionierte Hunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 71,
    name: "Beagle-Harrier",
    description: "Französischer Laufhund, Mischung aus Beagle und Harrier.",
    origin: "Frankreich",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 45, max: 50, avg: 47.5, category: "Mittel"},
    weight_info: {min: 19, max: 21},
    life_expectancy: "12-15 Jahre",
    temperament: ["Lebhaft", "Jagdtrieb", "Sozial"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Beagle-Harrier sind lebhafte, freundliche und jagdlich ambitionierte Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 72,
    name: "Schweizer Laufhund",
    description: "Vielseitiger, mittelgroßer Laufhund aus der Schweiz.",
    origin: "Schweiz",
    category: "Laufhunde & Schweißhunde",
    size_info: {min: 47, max: 59, avg: 53.0, category: "Mittel"},
    weight_info: {min: 15, max: 25},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Jagdtrieb", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Schweizer Laufhunde sind vielseitige, freundliche und jagdlich ambitionierte Hunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 2,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 73,
    name: "Deutsch Drahthaar",
    description: "Vielseitiger deutscher Jagdhund, robust und ausdauernd.",
    origin: "Deutschland",
    category: "Vorstehhunde",
    size_info: {min: 60, max: 67, avg: 63.5, category: "Groß"},
    weight_info: {min: 27, max: 32},
    life_expectancy: "12-14 Jahre",
    temperament: ["Arbeitsfreudig", "Intelligent", "Freundlich"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Der Deutsch Drahthaar ist ein passionierter Jagdhund, der viel Beschäftigung und Auslauf braucht.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 3,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 74,
    name: "Weimaraner",
    description: "Eleganter, großer Jagdhund mit silbergrauem Fell.",
    origin: "Deutschland",
    category: "Vorstehhunde",
    size_info: {min: 57, max: 70, avg: 63.5, category: "Groß"},
    weight_info: {min: 25, max: 40},
    life_expectancy: "10-13 Jahre",
    temperament: ["Intelligent", "Aktiv", "Treu"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Weimaraner sind sehr aktiv, intelligent und brauchen viel Beschäftigung.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 75,
    name: "Magyar Vizsla",
    description: "Ungarischer Vorstehhund, freundlich und sportlich.",
    origin: "Ungarn",
    category: "Vorstehhunde",
    size_info: {min: 54, max: 64, avg: 59.0, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Sportlich", "Intelligent"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Der Magyar Vizsla ist sehr freundlich, sportlich und menschenbezogen.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 76,
    name: "Deutsch Kurzhaar",
    description: "Deutscher Vorstehhund, vielseitig und sportlich.",
    origin: "Deutschland",
    category: "Vorstehhunde",
    size_info: {min: 58, max: 66, avg: 62.0, category: "Groß"},
    weight_info: {min: 25, max: 32},
    life_expectancy: "12-14 Jahre",
    temperament: ["Vielseitig", "Sportlich", "Intelligent"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Deutsch Kurzhaar sind vielseitige Jagdhunde mit viel Energie.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 77,
    name: "Deutsch Langhaar",
    description: "Längerhaariger deutscher Vorstehhund.",
    origin: "Deutschland",
    category: "Vorstehhunde",
    size_info: {min: 60, max: 70, avg: 65.0, category: "Groß"},
    weight_info: {min: 25, max: 35},
    life_expectancy: "12-14 Jahre",
    temperament: ["Vielseitig", "Sportlich", "Intelligent"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Deutsch Langhaar sind vielseitige, freundliche Jagdhunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 3
  }
,
  {
    id: 78,
    name: "Deutsch Stichelhaar",
    description: "Rauhhaariger deutscher Vorstehhund.",
    origin: "Deutschland",
    category: "Vorstehhunde",
    size_info: {min: 60, max: 70, avg: 65.0, category: "Groß"},
    weight_info: {min: 20, max: 29},
    life_expectancy: "12-14 Jahre",
    temperament: ["Vielseitig", "Sportlich", "Intelligent"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Deutsch Stichelhaar sind vielseitige Jagdhunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 79,
    name: "Pudelpointer",
    description: "Deutscher Jagdhund, Kreuzung aus Pudel und Pointer.",
    origin: "Deutschland",
    category: "Vorstehhunde",
    size_info: {min: 55, max: 68, avg: 61.5, category: "Groß"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "12-14 Jahre",
    temperament: ["Vielseitig", "Sportlich", "Intelligent"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Pudelpointers sind vielseitige, freundliche Jagdhunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 80,
    name: "Griffon Korthals",
    description: "Rauhhaariger Vorstehhund aus Frankreich.",
    origin: "Frankreich",
    category: "Vorstehhunde",
    size_info: {min: 50, max: 60, avg: 55.0, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "12-14 Jahre",
    temperament: ["Vielseitig", "Sportlich", "Intelligent"],
    care_level: "Aktive Halter",
    care_level_numeric: 3,
    detailed_info: "Griffon Korthals sind vielseitige, freundliche Jagdhunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 81,
    name: "Labrador Retriever",
    description: "Freundlicher, intelligenter Familienhund.",
    origin: "Kanada",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 54, max: 57, avg: 55.5, category: "Mittel"},
    weight_info: {min: 25, max: 36},
    life_expectancy: "10-12 Jahre",
    temperament: ["Freundlich", "Aktiv", "Gesellig"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Labradore sind sehr lernfähig, menschenbezogen und lieben Wasser.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 5,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 82,
    name: "Golden Retriever",
    description: "Freundlich, ausgeglichen, sehr familiengeeignet.",
    origin: "Schottland",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 51, max: 61, avg: 56.0, category: "Mittel"},
    weight_info: {min: 25, max: 34},
    life_expectancy: "10-12 Jahre",
    temperament: ["Freundlich", "Geduldig", "Intelligent"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Golden Retriever sind sehr menschenbezogen, freundlich und leicht zu erziehen.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 5,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 83,
    name: "Flat Coated Retriever",
    description: "Fröhlicher, aktiver Apportierhund mit glänzendem Fell.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 56, max: 61, avg: 58.5, category: "Mittel"},
    weight_info: {min: 25, max: 36},
    life_expectancy: "8-14 Jahre",
    temperament: ["Fröhlich", "Aktiv", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Flat Coated Retriever sind freundlich, verspielt und brauchen viel Bewegung.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 84,
    name: "Chesapeake Bay Retriever",
    description: "Amerikanischer Apportierhund, robust und wasserliebend.",
    origin: "USA",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 53, max: 66, avg: 59.5, category: "Mittel"},
    weight_info: {min: 25, max: 36},
    life_expectancy: "10-13 Jahre",
    temperament: ["Robust", "Freundlich", "Wasserliebend"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Chesapeake Bay Retriever sind robuste, wasserliebende Apportierhunde.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 85,
    name: "Nova Scotia Duck Tolling Retriever",
    description: "Kleiner, roter Apportierhund aus Kanada.",
    origin: "Kanada",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 45, max: 51, avg: 48.0, category: "Mittel"},
    weight_info: {min: 17, max: 23},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Freundlich", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Nova Scotia Duck Tolling Retriever sind lebhafte, freundliche Apportierhunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 86,
    name: "Curly Coated Retriever",
    description: "Lockiger britischer Apportierhund.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 64, max: 69, avg: 66.5, category: "Groß"},
    weight_info: {min: 32, max: 36},
    life_expectancy: "10-12 Jahre",
    temperament: ["Freundlich", "Intelligent", "Aktiv"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Curly Coated Retriever sind freundliche, aktive Apportierhunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 3,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 87,
    name: "Irish Water Spaniel",
    description: "Irischer Apportierhund mit lockigem Fell.",
    origin: "Irland",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 51, max: 59, avg: 55.0, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "10-12 Jahre",
    temperament: ["Freundlich", "Intelligent", "Wasserliebend"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Irish Water Spaniel sind freundliche, wasserliebende Apportierhunde.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 88,
    name: "American Cocker Spaniel",
    description: "Kleiner, freundlicher Stöberhund.",
    origin: "USA",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 34, max: 39, avg: 36.5, category: "Klein"},
    weight_info: {min: 9, max: 13},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Verspielt", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "American Cocker Spaniel sind freundliche, verspielte Stöberhunde.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 89,
    name: "English Cocker Spaniel",
    description: "Britischer Stöberhund, freundlich und verspielt.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 38, max: 43, avg: 40.5, category: "Mittel"},
    weight_info: {min: 13, max: 16},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Verspielt", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "English Cocker Spaniel sind freundliche, verspielte Stöberhunde.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 90,
    name: "English Springer Spaniel",
    description: "Britischer Stöberhund, lebhaft und freundlich.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 48, max: 56, avg: 52.0, category: "Mittel"},
    weight_info: {min: 18, max: 23},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Freundlich", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "English Springer Spaniel sind lebhafte, freundliche Stöberhunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 91,
    name: "Field Spaniel",
    description: "Britischer Stöberhund, freundlich und ruhig.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 43, max: 46, avg: 44.5, category: "Mittel"},
    weight_info: {min: 18, max: 25},
    life_expectancy: "12-14 Jahre",
    temperament: ["Freundlich", "Ruhig", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Field Spaniel sind freundliche, ruhige Stöberhunde.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 92,
    name: "Clumber Spaniel",
    description: "Schwerer, britischer Stöberhund.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 43, max: 51, avg: 47.0, category: "Mittel"},
    weight_info: {min: 25, max: 39},
    life_expectancy: "10-12 Jahre",
    temperament: ["Ruhig", "Freundlich", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Clumber Spaniel sind ruhige, freundliche Stöberhunde.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 93,
    name: "Sussex Spaniel",
    description: "Kleiner, britischer Stöberhund.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 38, max: 41, avg: 39.5, category: "Klein"},
    weight_info: {min: 18, max: 23},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Ruhig", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Sussex Spaniel sind freundliche, ruhige Stöberhunde.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 5,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 94,
    name: "Welsh Springer Spaniel",
    description: "Kleiner, britischer Stöberhund.",
    origin: "Wales",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 43, max: 48, avg: 45.5, category: "Mittel"},
    weight_info: {min: 16, max: 20},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Lebhaft", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Welsh Springer Spaniel sind freundliche, lebhafte Stöberhunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 95,
    name: "Irish Water Spaniel",
    description: "Irischer Apportierhund mit lockigem Fell.",
    origin: "Irland",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 51, max: 59, avg: 55.0, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "10-12 Jahre",
    temperament: ["Freundlich", "Intelligent", "Wasserliebend"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Irish Water Spaniel sind freundliche, wasserliebende Apportierhunde.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 96,
    name: "Field Spaniel",
    description: "Britischer Stöberhund, freundlich und ruhig.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 43, max: 46, avg: 44.5, category: "Mittel"},
    weight_info: {min: 18, max: 25},
    life_expectancy: "12-14 Jahre",
    temperament: ["Freundlich", "Ruhig", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Field Spaniel sind freundliche, ruhige Stöberhunde.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 97,
    name: "Clumber Spaniel",
    description: "Schwerer, britischer Stöberhund.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 43, max: 51, avg: 47.0, category: "Mittel"},
    weight_info: {min: 25, max: 39},
    life_expectancy: "10-12 Jahre",
    temperament: ["Ruhig", "Freundlich", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Clumber Spaniel sind ruhige, freundliche Stöberhunde.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 98,
    name: "Sussex Spaniel",
    description: "Kleiner, britischer Stöberhund.",
    origin: "Großbritannien",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 38, max: 41, avg: 39.5, category: "Klein"},
    weight_info: {min: 18, max: 23},
    life_expectancy: "12-15 Jahre",
    temperament: ["Freundlich", "Ruhig", "Intelligent"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Sussex Spaniel sind freundliche, ruhige Stöberhunde.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 5,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 99,
    name: "Welsh Corgi Pembroke",
    description: "Kleiner, wendiger Treibhund aus Wales.",
    origin: "Wales",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 25, max: 30, avg: 27.5, category: "Klein"},
    weight_info: {min: 9, max: 12},
    life_expectancy: "12-15 Jahre",
    temperament: ["Intelligent", "Freundlich", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Welsh Corgis sind sehr intelligente, freundliche und wachsame Hunde, die ursprünglich zum Treiben von Rindern gezüchtet wurden.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 100,
    name: "Welsh Corgi Cardigan",
    description: "Kleiner, kräftiger Treibhund mit langem Körper.",
    origin: "Wales",
    category: "Apportier-, Stöber- & Wasserhunde",
    size_info: {min: 25, max: 33, avg: 29.0, category: "Klein"},
    weight_info: {min: 11, max: 17},
    life_expectancy: "12-15 Jahre",
    temperament: ["Intelligent", "Freundlich", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Cardigan Corgis sind freundlich, intelligent und vielseitig, mit sehr langer Geschichte.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 101,
    name: "Bichon Frisé",
    description: "Kleiner, weißer, lockiger Begleithund.",
    origin: "Frankreich/Belgien",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 23, max: 30, avg: 26.5, category: "Klein"},
    weight_info: {min: 3, max: 5},
    life_expectancy: "12-15 Jahre",
    temperament: ["Fröhlich", "Anpassungsfähig", "Verspielt"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bichon Frisés sind sehr freundliche, verspielte und pflegeleichte Hunde.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 3
  }
,
  {
    id: 102,
    name: "Malteser",
    description: "Kleiner, weißer Begleithund mit langem Fell.",
    origin: "Mittelmeerraum",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 21, max: 25, avg: 23.0, category: "Sehr klein"},
    weight_info: {min: 3, max: 4},
    life_expectancy: "12-15 Jahre",
    temperament: ["Anhänglich", "Fröhlich", "Verspielt"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Malteser sind sehr anhänglich, freundlich und eignen sich gut für Familien.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 103,
    name: "Havaneser",
    description: "Kleiner, fröhlicher Begleithund mit seidigem Fell.",
    origin: "Kuba",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 23, max: 27, avg: 25.0, category: "Klein"},
    weight_info: {min: 3, max: 6},
    life_expectancy: "13-15 Jahre",
    temperament: ["Fröhlich", "Lebhaft", "Anpassungsfähig"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Havaneser sind sehr freundlich, verspielt und pflegeleicht.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 3
  }
,
  {
    id: 104,
    name: "Pudel (alle Größen)",
    description: "Intelligenter, freundlicher und nicht haarender Begleithund.",
    origin: "Frankreich/Deutschland",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 24, max: 60, avg: 42.0, category: "Mittel"},
    weight_info: {min: 6, max: 32},
    life_expectancy: "12-15 Jahre",
    temperament: ["Intelligent", "Freundlich", "Verspielt"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Pudel sind sehr intelligent, freundlich und haaren kaum. Sie eignen sich gut für Allergiker.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 105,
    name: "Shih Tzu",
    description: "Kleiner, langhaariger Begleithund mit asiatischem Ursprung.",
    origin: "Tibet/China",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 20, max: 28, avg: 24.0, category: "Sehr klein"},
    weight_info: {min: 4, max: 7},
    life_expectancy: "10-16 Jahre",
    temperament: ["Fröhlich", "Anpassungsfähig", "Verspielt"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Shih Tzus sind freundlich, verspielt und benötigen regelmäßige Fellpflege.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 4
  }
,
  {
    id: 106,
    name: "Cavalier King Charles Spaniel",
    description: "Kleiner, eleganter Begleithund mit rundem Kopf.",
    origin: "Großbritannien",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 30, max: 33, avg: 31.5, category: "Klein"},
    weight_info: {min: 5, max: 8},
    life_expectancy: "9-14 Jahre",
    temperament: ["Sanft", "Anhänglich", "Verspielt"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Cavalier King Charles Spaniel sind freundlich, verspielt und sehr familienbezogen.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 107,
    name: "Papillon",
    description: "Kleiner, lebhafter Begleithund mit Schmetterlingsohren.",
    origin: "Frankreich/Belgien",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 20, max: 28, avg: 24.0, category: "Sehr klein"},
    weight_info: {min: 2, max: 5},
    life_expectancy: "13-16 Jahre",
    temperament: ["Lebhaft", "Intelligent", "Anhänglich"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Papillons sind kleine, intelligente und sehr anhängliche Hunde.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 108,
    name: "Bologneser",
    description: "Kleiner, weißer, lockiger Begleithund.",
    origin: "Italien",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 25, max: 30, avg: 27.5, category: "Klein"},
    weight_info: {min: 2, max: 5},
    life_expectancy: "12-15 Jahre",
    temperament: ["Fröhlich", "Ruhig", "Anhänglich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Bologneser sind sehr freundliche, ruhige und anhängliche Hunde.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 5,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 109,
    name: "Lhasa Apso",
    description: "Kleiner, langhaariger Begleithund aus Tibet.",
    origin: "Tibet",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 25, max: 28, avg: 26.5, category: "Klein"},
    weight_info: {min: 6, max: 7},
    life_expectancy: "12-15 Jahre",
    temperament: ["Unabhängig", "Fröhlich", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Lhasa Apsos sind unabhängige, fröhliche und wachsame Begleithunde.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 110,
    name: "Coton de Tuléar",
    description: "Kleiner, weißer, langhaariger Begleithund aus Madagaskar.",
    origin: "Madagaskar",
    category: "Gesellschafts- & Begleithunde",
    size_info: {min: 22, max: 28, avg: 25.0, category: "Klein"},
    weight_info: {min: 3, max: 5},
    life_expectancy: "14-16 Jahre",
    temperament: ["Fröhlich", "Anhänglich", "Verspielt"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Coton de Tuléar sind sehr fröhliche, anhängliche und verspielte Hunde.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 111,
    name: "Whippet",
    description: "Eleganter, schneller, sanfter Windhund.",
    origin: "England",
    category: "Windhunde",
    size_info: {min: 44, max: 51, avg: 47.5, category: "Mittel"},
    weight_info: {min: 9, max: 15},
    life_expectancy: "12-15 Jahre",
    temperament: ["Sanft", "Schnell", "Freundlich"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Whippets sind sehr schnelle, freundliche und sanfte Hunde.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 5,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 112,
    name: "Afghanischer Windhund",
    description: "Eleganter, langhaariger Windhund aus Afghanistan.",
    origin: "Afghanistan",
    category: "Windhunde",
    size_info: {min: 61, max: 74, avg: 67.5, category: "Groß"},
    weight_info: {min: 23, max: 27},
    life_expectancy: "12-14 Jahre",
    temperament: ["Elegant", "Unabhängig", "Schnell"],
    care_level: "Anspruchsvoll",
    care_level_numeric: 4,
    detailed_info: "Afghanische Windhunde sind sehr elegant, schnell und unabhängig.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 1,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 1,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 113,
    name: "Greyhound",
    description: "Der schnellste Windhund der Welt.",
    origin: "Großbritannien",
    category: "Windhunde",
    size_info: {min: 68, max: 76, avg: 72.0, category: "Groß"},
    weight_info: {min: 27, max: 40},
    life_expectancy: "10-14 Jahre",
    temperament: ["Sanft", "Schnell", "Zurückhaltend"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Greyhounds sind sehr schnelle, elegante Hunde, die zu Hause ruhig und anschmiegsam sind.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 114,
    name: "Irish Wolfhound",
    description: "Sehr großer, sanfter Windhund aus Irland.",
    origin: "Irland",
    category: "Windhunde",
    size_info: {min: 71, max: 86, avg: 78.5, category: "Groß"},
    weight_info: {min: 40, max: 70},
    life_expectancy: "6-10 Jahre",
    temperament: ["Sanft", "Freundlich", "Ruhig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Irish Wolfhounds sind sehr große, sanfte Riesen.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 115,
    name: "Saluki",
    description: "Orientalischer Windhund, elegant und ausdauernd.",
    origin: "Naher Osten",
    category: "Windhunde",
    size_info: {min: 58, max: 71, avg: 64.5, category: "Groß"},
    weight_info: {min: 18, max: 27},
    life_expectancy: "12-14 Jahre",
    temperament: ["Elegant", "Unabhängig", "Schnell"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Salukis sind sehr elegante, ausdauernde Windhunde mit Jagdtrieb.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 1,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 116,
    name: "Borzoi (Russischer Windhund)",
    description: "Russischer Jagdwindhund, sehr elegant.",
    origin: "Russland",
    category: "Windhunde",
    size_info: {min: 68, max: 85, avg: 76.5, category: "Groß"},
    weight_info: {min: 34, max: 48},
    life_expectancy: "10-12 Jahre",
    temperament: ["Ruhig", "Sanft", "Schnell"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Borzois sind elegante, freundliche Windhunde mit langem Fell.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 117,
    name: "Italienisches Windspiel",
    description: "Kleiner, zierlicher Windhund.",
    origin: "Italien",
    category: "Windhunde",
    size_info: {min: 32, max: 38, avg: 35.0, category: "Klein"},
    weight_info: {min: 3, max: 5},
    life_expectancy: "12-15 Jahre",
    temperament: ["Zart", "Lebhaft", "Anhänglich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Italienische Windspiele sind zierlich, anhänglich und sensibel.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 118,
    name: "Galgo Español",
    description: "Spanischer Windhund, ruhig und freundlich.",
    origin: "Spanien",
    category: "Windhunde",
    size_info: {min: 60, max: 70, avg: 65.0, category: "Groß"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "12-14 Jahre",
    temperament: ["Ruhig", "Schnell", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Galgo Españols sind sehr beliebte Windhunde aus Spanien.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 119,
    name: "Magyar Agar",
    description: "Ungarischer Windhund, sportlich und robust.",
    origin: "Ungarn",
    category: "Windhunde",
    size_info: {min: 65, max: 70, avg: 67.5, category: "Groß"},
    weight_info: {min: 25, max: 35},
    life_expectancy: "12-14 Jahre",
    temperament: ["Sportlich", "Freundlich", "Schnell"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Magyar Agars sind robuste, schnelle Windhunde.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 3,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 120,
    name: "Sloughi",
    description: "Nordafrikanischer Windhund, elegant und ausdauernd.",
    origin: "Marokko/Tunesien",
    category: "Windhunde",
    size_info: {min: 60, max: 72, avg: 66.0, category: "Groß"},
    weight_info: {min: 22, max: 28},
    life_expectancy: "12-15 Jahre",
    temperament: ["Elegant", "Unabhängig", "Schnell"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Sloughis sind elegante, ausdauernde Windhunde mit feinem Wesen.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 1,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 121,
    name: "Polnischer Windhund (Chart Polski)",
    description: "Großer, kräftiger Windhund aus Polen.",
    origin: "Polen",
    category: "Windhunde",
    size_info: {min: 68, max: 80, avg: 74.0, category: "Groß"},
    weight_info: {min: 27, max: 40},
    life_expectancy: "10-12 Jahre",
    temperament: ["Selbstbewusst", "Schnell", "Unabhängig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Chart Polski sind kräftige, schnelle Windhunde mit eigenständigem Charakter.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 1,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 122,
    name: "Deerhound",
    description: "Schottischer Hirschhund, sehr groß und edel.",
    origin: "Schottland",
    category: "Windhunde",
    size_info: {min: 71, max: 81, avg: 76.0, category: "Groß"},
    weight_info: {min: 34, max: 50},
    life_expectancy: "8-11 Jahre",
    temperament: ["Sanft", "Edle", "Schnell"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Deerhounds sind große, edle Windhunde mit sanftem Wesen.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 123,
    name: "Azawakh",
    description: "Afrikanischer Windhund, sehr schlank und ausdauernd.",
    origin: "Westafrika",
    category: "Windhunde",
    size_info: {min: 60, max: 74, avg: 67.0, category: "Groß"},
    weight_info: {min: 15, max: 25},
    life_expectancy: "12-14 Jahre",
    temperament: ["Unabhängig", "Schnell", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Azawakhs sind sehr schlank, ausdauernd und wachsam.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 1,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 124,
    name: "Barsoi (Russischer Windhund)",
    description: "Eleganter, langhaariger russischer Windhund.",
    origin: "Russland",
    category: "Windhunde",
    size_info: {min: 68, max: 85, avg: 76.5, category: "Groß"},
    weight_info: {min: 34, max: 48},
    life_expectancy: "10-12 Jahre",
    temperament: ["Ruhig", "Sanft", "Schnell"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Barsois sind elegante, freundliche Windhunde mit langem Fell.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 125,
    name: "Pharaonenhund",
    description: "Eleganter, mittelgroßer Windhund aus Malta.",
    origin: "Malta",
    category: "Windhunde",
    size_info: {min: 53, max: 63, avg: 58.0, category: "Mittel"},
    weight_info: {min: 18, max: 27},
    life_expectancy: "11-14 Jahre",
    temperament: ["Wachsam", "Lebhaft", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Pharaonenhunde sind elegante, freundliche und wachsame Windhunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 126,
    name: "Ibizan Hound (Podenco Ibicenco)",
    description: "Spanischer Windhund, sehr beweglich und wachsam.",
    origin: "Spanien",
    category: "Windhunde",
    size_info: {min: 56, max: 74, avg: 65.0, category: "Groß"},
    weight_info: {min: 20, max: 29},
    life_expectancy: "12-14 Jahre",
    temperament: ["Wachsam", "Schnell", "Unabhängig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Ibizan Hounds sind sehr beweglich, schnell und wachsam.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 1,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 127,
    name: "Podenco Canario",
    description: "Spanischer Windhund von den Kanaren.",
    origin: "Spanien",
    category: "Windhunde",
    size_info: {min: 53, max: 64, avg: 58.5, category: "Mittel"},
    weight_info: {min: 20, max: 25},
    life_expectancy: "11-13 Jahre",
    temperament: ["Lebhaft", "Wachsam", "Unabhängig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Podenco Canario sind lebhafte, wachsame Windhunde.",
    activity_level: 4,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 128,
    name: "Basenji",
    description: "Kleiner, afrikanischer Jagdhund, bekannt für sein fehlendes Bellen.",
    origin: "Zentralafrika",
    category: "Windhunde",
    size_info: {min: 40, max: 43, avg: 41.5, category: "Mittel"},
    weight_info: {min: 9, max: 12},
    life_expectancy: "12-14 Jahre",
    temperament: ["Unabhängig", "Sauber", "Lebhaft"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Basenjis bellen nicht, sondern geben jodelnde Laute von sich.",
    activity_level: 4,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 129,
    name: "Cirneco dell’Etna",
    description: "Kleiner, italienischer Windhund von Sizilien.",
    origin: "Italien",
    category: "Windhunde",
    size_info: {min: 42, max: 50, avg: 46.0, category: "Mittel"},
    weight_info: {min: 8, max: 12},
    life_expectancy: "12-14 Jahre",
    temperament: ["Lebhaft", "Wachsam", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Cirneco dell’Etna sind lebhafte, freundliche und wachsame Windhunde.",
    activity_level: 4,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 130,
    name: "Thai Ridgeback",
    description: "Seltene, ursprüngliche Rasse aus Thailand.",
    origin: "Thailand",
    category: "Windhunde",
    size_info: {min: 51, max: 61, avg: 56.0, category: "Mittel"},
    weight_info: {min: 16, max: 34},
    life_expectancy: "12-13 Jahre",
    temperament: ["Unabhängig", "Wachsam", "Mutig"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Thai Ridgebacks sind unabhängige, wachsame und mutige Hunde.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 131,
    name: "Peruanischer Nackthund",
    description: "Haarloser Windhund aus Peru.",
    origin: "Peru",
    category: "Windhunde",
    size_info: {min: 25, max: 65, avg: 45.0, category: "Mittel"},
    weight_info: {min: 4, max: 25},
    life_expectancy: "12-14 Jahre",
    temperament: ["Sanft", "Wachsam", "Anhänglich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Peruanische Nackthunde sind haarlos, anhänglich und freundlich.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 4,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 132,
    name: "Xoloitzcuintle (Mexikanischer Nackthund)",
    description: "Uralte, haarlose Hunderasse aus Mexiko.",
    origin: "Mexiko",
    category: "Windhunde",
    size_info: {min: 25, max: 60, avg: 42.5, category: "Mittel"},
    weight_info: {min: 4, max: 25},
    life_expectancy: "13-15 Jahre",
    temperament: ["Ruhig", "Anhänglich", "Wachsam"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Xoloitzcuintles sind haarlos, ruhig und sehr familienbezogen.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 133,
    name: "Rhodesian Ridgeback",
    description: "Afrikanischer Jagdhund mit charakteristischem Rückenkamm.",
    origin: "Südafrika",
    category: "Windhunde",
    size_info: {min: 61, max: 69, avg: 65.0, category: "Groß"},
    weight_info: {min: 32, max: 36},
    life_expectancy: "10-12 Jahre",
    temperament: ["Mutig", "Unabhängig", "Treu"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Rhodesian Ridgebacks sind mutige, unabhängige und sehr treue Hunde.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 134,
    name: "Afghanischer Windhund",
    description: "Eleganter, langhaariger Windhund aus Afghanistan.",
    origin: "Afghanistan",
    category: "Windhunde",
    size_info: {min: 61, max: 74, avg: 67.5, category: "Groß"},
    weight_info: {min: 23, max: 27},
    life_expectancy: "12-14 Jahre",
    temperament: ["Elegant", "Unabhängig", "Schnell"],
    care_level: "Anspruchsvoll",
    care_level_numeric: 4,
    detailed_info: "Afghanische Windhunde sind sehr elegant, schnell und unabhängig.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 1,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 1,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 135,
    name: "Sloughi",
    description: "Nordafrikanischer Windhund, elegant und ausdauernd.",
    origin: "Marokko/Tunesien",
    category: "Windhunde",
    size_info: {min: 60, max: 72, avg: 66.0, category: "Groß"},
    weight_info: {min: 22, max: 28},
    life_expectancy: "12-15 Jahre",
    temperament: ["Elegant", "Unabhängig", "Schnell"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Sloughis sind elegante, ausdauernde Windhunde mit feinem Wesen.",
    activity_level: 5,
    family_friendly: 2,
    good_with_children: 1,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 3,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 136,
    name: "Magyar Agar",
    description: "Ungarischer Windhund, sportlich und robust.",
    origin: "Ungarn",
    category: "Windhunde",
    size_info: {min: 65, max: 70, avg: 67.5, category: "Groß"},
    weight_info: {min: 25, max: 35},
    life_expectancy: "12-14 Jahre",
    temperament: ["Sportlich", "Freundlich", "Schnell"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Magyar Agars sind robuste, schnelle Windhunde.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 3,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 137,
    name: "Galgo Español",
    description: "Spanischer Windhund, ruhig und freundlich.",
    origin: "Spanien",
    category: "Windhunde",
    size_info: {min: 60, max: 70, avg: 65.0, category: "Groß"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "12-14 Jahre",
    temperament: ["Ruhig", "Schnell", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Galgo Españols sind sehr beliebte Windhunde aus Spanien.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: false,
    apartment_suitable: 4,
    beginner_friendly: 4,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 138,
    name: "Italienisches Windspiel",
    description: "Kleiner, zierlicher Windhund.",
    origin: "Italien",
    category: "Windhunde",
    size_info: {min: 32, max: 38, avg: 35.0, category: "Klein"},
    weight_info: {min: 3, max: 5},
    life_expectancy: "12-15 Jahre",
    temperament: ["Zart", "Lebhaft", "Anhänglich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Italienische Windspiele sind zierlich, anhänglich und sensibel.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 3,
    beginner_friendly: 3,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 139,
    name: "Whippet",
    description: "Eleganter, schneller, sanfter Windhund.",
    origin: "England",
    category: "Windhunde",
    size_info: {min: 44, max: 51, avg: 47.5, category: "Mittel"},
    weight_info: {min: 9, max: 15},
    life_expectancy: "12-15 Jahre",
    temperament: ["Sanft", "Schnell", "Freundlich"],
    care_level: "Einfach",
    care_level_numeric: 1,
    detailed_info: "Whippets sind sehr schnelle, freundliche und sanfte Hunde.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 5,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 140,
    name: "Greyhound",
    description: "Der schnellste Windhund der Welt.",
    origin: "Großbritannien",
    category: "Windhunde",
    size_info: {min: 68, max: 76, avg: 72.0, category: "Groß"},
    weight_info: {min: 27, max: 40},
    life_expectancy: "10-14 Jahre",
    temperament: ["Sanft", "Schnell", "Zurückhaltend"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Greyhounds sind sehr schnelle, elegante Hunde, die zu Hause ruhig und anschmiegsam sind.",
    activity_level: 5,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: false,
    apartment_suitable: 2,
    beginner_friendly: 4,
    exercise_needs: 5,
    grooming_needs: 2
  }
,
  {
    id: 141,
    name: "Mops",
    description: "Kleiner, kompakter Hund mit extremer Kurzschnauze.",
    origin: "China",
    category: "Qualzuchten",
    size_info: {min: 25, max: 30, avg: 27.5, category: "Klein"},
    weight_info: {min: 6, max: 8},
    life_expectancy: "10-13 Jahre",
    temperament: ["Anhänglich", "Gesellig", "Lustig"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Leidet unter schweren Atemproblemen (Brachyzephalie), Augenverletzungen und Hautinfektionen. Extrem überzüchtete Rasse.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 142,
    name: "Französische Bulldogge",
    description: "Kleiner Hund mit Fledermausohren und kurzer Nase.",
    origin: "Frankreich",
    category: "Qualzuchten",
    size_info: {min: 28, max: 31, avg: 29.5, category: "Klein"},
    weight_info: {min: 8, max: 14},
    life_expectancy: "9-11 Jahre",
    temperament: ["Verspielt", "Anhänglich", "Wachsam"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Atemnot, Wirbelsäulenprobleme und Hautfaltenentzündungen sind typisch. Häufige Kaiserschnitte bei der Geburt.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 143,
    name: "Englische Bulldogge",
    description: "Muskulöser Hund mit extrem kurzer Schnauze.",
    origin: "Großbritannien",
    category: "Qualzuchten",
    size_info: {min: 31, max: 40, avg: 35.5, category: "Klein"},
    weight_info: {min: 18, max: 25},
    life_expectancy: "6-8 Jahre",
    temperament: ["Ruhig", "Freundlich", "Beständig"],
    care_level: "Sehr hoch",
    care_level_numeric: 4,
    detailed_info: "Extreme Atemprobleme, Hautinfektionen, Herzprobleme. Kurze Lebenserwartung durch Überzüchtung.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: true,
    apartment_suitable: 5,
    beginner_friendly: 2,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 144,
    name: "Chihuahua (Extremzucht)",
    description: "Kleinste Hunderasse, oft mit offenen Schädeldecken.",
    origin: "Mexiko",
    category: "Qualzuchten",
    size_info: {min: 15, max: 23, avg: 19.0, category: "Sehr klein"},
    weight_info: {min: 1, max: 5},
    life_expectancy: "14-17 Jahre",
    temperament: ["Lebhaft", "Mutig", "Anhänglich"],
    care_level: "Anspruchsvoll",
    care_level_numeric: 4,
    detailed_info: "Leidet häufig unter offenen Schädeldecken, Zahnproblemen und weiteren zuchtbedingten Krankheiten.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 3,
    beginner_friendly: 1,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 145,
    name: "Dackel (Extremzucht)",
    description: "Dackel mit extrem langem Rücken.",
    origin: "Deutschland",
    category: "Qualzuchten",
    size_info: {min: 15, max: 27, avg: 21.0, category: "Sehr klein"},
    weight_info: {min: 3, max: 9},
    life_expectancy: "12-16 Jahre",
    temperament: ["Mutig", "Stur", "Freundlich"],
    care_level: "Mittel",
    care_level_numeric: 2,
    detailed_info: "Leidet häufig unter Bandscheibenvorfällen und Rückenproblemen.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 3,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 146,
    name: "Cavalier King Charles Spaniel (Extremzucht)",
    description: "Kleiner Begleithund mit extrem rundem Kopf.",
    origin: "Großbritannien",
    category: "Qualzuchten",
    size_info: {min: 30, max: 33, avg: 31.5, category: "Klein"},
    weight_info: {min: 5, max: 8},
    life_expectancy: "9-14 Jahre",
    temperament: ["Sanft", "Anhänglich", "Verspielt"],
    care_level: "Anspruchsvoll",
    care_level_numeric: 4,
    detailed_info: "Leidet oft unter zu kleinen Schädeln, Herz- und Augenkrankheiten.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 2,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 147,
    name: "Pekingese (Extremzucht)",
    description: "Sehr kleiner, langhaariger Begleithund mit kurzer Nase.",
    origin: "China",
    category: "Qualzuchten",
    size_info: {min: 15, max: 23, avg: 19.0, category: "Sehr klein"},
    weight_info: {min: 3, max: 6},
    life_expectancy: "12-15 Jahre",
    temperament: ["Stur", "Mutig", "Anhänglich"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Leidet häufig unter Atemproblemen, Augenerkrankungen und Bandscheibenvorfällen.",
    activity_level: 3,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 148,
    name: "Shih Tzu (Extremzucht)",
    description: "Kleiner Begleithund mit sehr kurzer Nase.",
    origin: "Tibet/China",
    category: "Qualzuchten",
    size_info: {min: 20, max: 28, avg: 24.0, category: "Sehr klein"},
    weight_info: {min: 4, max: 7},
    life_expectancy: "10-16 Jahre",
    temperament: ["Fröhlich", "Anpassungsfähig", "Verspielt"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Extrem kurz gezüchtete Shih Tzus leiden häufig unter Atemnot und Augenproblemen.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 149,
    name: "Boston Terrier (Extremzucht)",
    description: "Kleiner, kompakter Hund mit sehr kurzer Nase.",
    origin: "USA",
    category: "Qualzuchten",
    size_info: {min: 23, max: 38, avg: 30.5, category: "Klein"},
    weight_info: {min: 6, max: 11},
    life_expectancy: "11-13 Jahre",
    temperament: ["Lebhaft", "Anhänglich", "Intelligent"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Boston Terrier aus Extremzuchten leiden oft unter Atemnot und Augenproblemen.",
    activity_level: 4,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 3,
    beginner_friendly: 1,
    exercise_needs: 4,
    grooming_needs: 2
  }
,
  {
    id: 150,
    name: "Englischer Bulldog (Extremzucht)",
    description: "Sehr kurzschnäuziger, massiger Hund.",
    origin: "England",
    category: "Qualzuchten",
    size_info: {min: 31, max: 40, avg: 35.5, category: "Klein"},
    weight_info: {min: 18, max: 25},
    life_expectancy: "6-8 Jahre",
    temperament: ["Freundlich", "Ruhig", "Stur"],
    care_level: "Sehr hoch",
    care_level_numeric: 4,
    detailed_info: "Extremzuchten führen zu schweren Atemproblemen, Hautfalten und Herzproblemen.",
    activity_level: 2,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: true,
    apartment_suitable: 5,
    beginner_friendly: 2,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 151,
    name: "King Charles Spaniel (Extremzucht)",
    description: "Kleiner Begleithund mit extrem rundem Kopf.",
    origin: "Großbritannien",
    category: "Qualzuchten",
    size_info: {min: 23, max: 28, avg: 25.5, category: "Klein"},
    weight_info: {min: 3, max: 6},
    life_expectancy: "10-12 Jahre",
    temperament: ["Sanft", "Anhänglich", "Verspielt"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Extremzuchten führen zu neurologischen Problemen und Atemnot.",
    activity_level: 3,
    family_friendly: 4,
    good_with_children: 5,
    good_with_pets: 3,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 2,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 152,
    name: "Französische Bulldogge (Extremzucht)",
    description: "Extrem kurzschnäuzige, überzüchtete Variante.",
    origin: "Frankreich",
    category: "Qualzuchten",
    size_info: {min: 28, max: 31, avg: 29.5, category: "Klein"},
    weight_info: {min: 8, max: 14},
    life_expectancy: "8-11 Jahre",
    temperament: ["Verspielt", "Anhänglich", "Wachsam"],
    care_level: "Sehr hoch",
    care_level_numeric: 4,
    detailed_info: "Leidet besonders stark unter Atemnot, Wirbelsäulenproblemen und Hautfaltenentzündungen.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 4,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 3,
    grooming_needs: 2
  }
,
  {
    id: 153,
    name: "Shar Pei (Extremzucht)",
    description: "Stark gefaltete Haut, häufige Entzündungen.",
    origin: "China",
    category: "Qualzuchten",
    size_info: {min: 44, max: 51, avg: 47.5, category: "Mittel"},
    weight_info: {min: 18, max: 25},
    life_expectancy: "9-11 Jahre",
    temperament: ["Ruhig", "Unabhängig", "Wachsam"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Shar Pei leiden häufig unter Haut- und Augenproblemen durch übermäßige Faltenbildung.",
    activity_level: 2,
    family_friendly: 2,
    good_with_children: 2,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 154,
    name: "Bulldogge Continental (Extremzucht)",
    description: "Stark verkürzter Fang, Atemnot.",
    origin: "Schweiz",
    category: "Qualzuchten",
    size_info: {min: 42, max: 46, avg: 44.0, category: "Mittel"},
    weight_info: {min: 20, max: 30},
    life_expectancy: "10-12 Jahre",
    temperament: ["Freundlich", "Ruhig", "Treu"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Leidet unter Atemnot und Gelenkproblemen.",
    activity_level: 2,
    family_friendly: 4,
    good_with_children: 4,
    good_with_pets: 4,
    noise_level: 2,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 2,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 155,
    name: "Chow Chow (Extremzucht)",
    description: "Stark gefaltete Haut, verkürzte Schnauze.",
    origin: "China",
    category: "Qualzuchten",
    size_info: {min: 46, max: 56, avg: 51.0, category: "Mittel"},
    weight_info: {min: 20, max: 32},
    life_expectancy: "9-12 Jahre",
    temperament: ["Eigenständig", "Ruhig", "Wachsam"],
    care_level: "Hoch",
    care_level_numeric: 3,
    detailed_info: "Chow Chows leiden unter Haut- und Atemproblemen durch Überzüchtung.",
    activity_level: 2,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 3,
    noise_level: 2,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 2,
    grooming_needs: 2
  }
,
  {
    id: 156,
    name: "Mops (Extremzucht)",
    description: "Extrem kurzschnäuziger Mops.",
    origin: "China",
    category: "Qualzuchten",
    size_info: {min: 25, max: 30, avg: 27.5, category: "Klein"},
    weight_info: {min: 6, max: 8},
    life_expectancy: "9-11 Jahre",
    temperament: ["Anhänglich", "Gesellig", "Lustig"],
    care_level: "Sehr hoch",
    care_level_numeric: 4,
    detailed_info: "Extremzucht-Möpse leiden besonders stark unter Atemnot und Augenproblemen.",
    activity_level: 3,
    family_friendly: 3,
    good_with_children: 3,
    good_with_pets: 4,
    noise_level: 3,
    health_issues: true,
    apartment_suitable: 4,
    beginner_friendly: 1,
    exercise_needs: 3,
    grooming_needs: 2
  }
];

// Application state
let currentStep = 1;
let answers = {};
const totalSteps = 8;

// DOM elements
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const analyzeBtn = document.getElementById('analyze-btn');
const questionnaire = document.getElementById('questionnaire');
const results = document.getElementById('results');
const navTabs = document.querySelectorAll('.nav-tab');
const sections = document.querySelectorAll('.section');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeQuestionnaire();
    initializeComparison();
    initializeBrowse();
    updateProgress();
    updateStepDisplay();
});

function initializeNavigation() {
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabName) {
    // Update active tab
    navTabs.forEach(tab => tab.classList.remove('nav-tab--active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('nav-tab--active');
    
    // Show corresponding section
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(`${tabName}-section`).classList.remove('hidden');
    
    // Reset questionnaire if switching away from matching
    if (tabName !== 'matching') {
        resetQuestionnaire();
    }
}

function initializeQuestionnaire() {
    prevBtn.addEventListener('click', previousStep);
    nextBtn.addEventListener('click', nextStep);
    analyzeBtn.addEventListener('click', analyzeResults);
    document.getElementById('restart-btn').addEventListener('click', resetQuestionnaire);
    document.getElementById('compare-results-btn').addEventListener('click', () => switchTab('compare'));
}

function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Schritt ${currentStep} von ${totalSteps}`;
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        }
    }
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.question-step').forEach(step => {
        step.classList.remove('question-step--active');
    });
    
    // Show current step
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('question-step--active');
    }
    
    // Update progress
    updateProgress();
    
    // Update button states
    prevBtn.disabled = currentStep === 1;
    
    if (currentStep === totalSteps) {
        nextBtn.classList.add('hidden');
        analyzeBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        analyzeBtn.classList.add('hidden');
    }
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentStepElement) {
        console.error('Current step element not found:', currentStep);
        return false;
    }
    
    // Get all radio button groups in the current step
    const radioInputs = currentStepElement.querySelectorAll('input[type="radio"]');
    const radioGroups = {};
    
    // Group radio buttons by name
    radioInputs.forEach(input => {
        if (!radioGroups[input.name]) {
            radioGroups[input.name] = [];
        }
        radioGroups[input.name].push(input);
    });
    
    // Check if each radio group has a selection
    for (const groupName in radioGroups) {
        const hasSelection = radioGroups[groupName].some(input => input.checked);
        if (!hasSelection) {
            alert('Bitte beantworte alle Fragen, bevor du fortfährst.');
            return false;
        }
    }
    
    return true;
}

function collectAnswers() {
    answers = {};
    
    // Collect all radio button data
    document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
        answers[input.name] = input.value;
    });
    
    // Collect checkbox data
    const checkboxGroups = {};
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
        if (!checkboxGroups[input.name]) {
            checkboxGroups[input.name] = [];
        }
        checkboxGroups[input.name].push(input.value);
    });
    
    // Add checkbox data to answers
    Object.keys(checkboxGroups).forEach(key => {
        answers[key] = checkboxGroups[key];
    });
    
    console.log('Collected answers:', answers);
    return answers;
}

function analyzeResults() {
    try {
        if (!validateCurrentStep()) return;
        
        collectAnswers();
        const matches = calculateMatches(answers);
        displayResults(matches);
        
        // Switch to results view
        questionnaire.classList.add('hidden');
        results.classList.remove('hidden');
    } catch (error) {
        console.error('Error analyzing results:', error);
        alert('Es gab einen Fehler bei der Berechnung. Bitte versuche es erneut.');
    }
}

function calculateMatches(userAnswers) {
    const matches = dogBreeds.map(breed => {
        const compatibility = calculateCompatibility(breed, userAnswers);
        return {
            breed,
            score: compatibility.score,
            explanation: compatibility.explanation,
            pros: compatibility.pros,
            cons: compatibility.cons
        };
    });
    
    // Sort by compatibility score (highest first)
    matches.sort((a, b) => b.score - a.score);
    
    // Return top 5 matches, but ensure we always have at least 3
    return matches.slice(0, Math.max(5, 3));
}

function calculateCompatibility(breed, answers) {
    let totalScore = 0;
    let maxScore = 0;
    const factors = [];
    
    // Factor 1: Size vs Housing (25% weight)
    const sizeScore = calculateSizeMatch(breed, answers);
    totalScore += sizeScore.score * 0.25;
    maxScore += 5 * 0.25;
    factors.push(sizeScore);
    
    // Factor 2: Activity Level Match (25% weight)
    const activityScore = calculateActivityMatch(breed, answers);
    totalScore += activityScore.score * 0.25;
    maxScore += 5 * 0.25;
    factors.push(activityScore);
    
    // Factor 3: Family Friendliness (20% weight)
    const familyScore = calculateFamilyMatch(breed, answers);
    totalScore += familyScore.score * 0.2;
    maxScore += 5 * 0.2;
    factors.push(familyScore);
    
    // Factor 4: Care Level vs Experience (15% weight)
    const careScore = calculateCareMatch(breed, answers);
    totalScore += careScore.score * 0.15;
    maxScore += 5 * 0.15;
    factors.push(careScore);
    
    // Factor 5: Temperament Match (15% weight)
    const temperamentScore = calculateTemperamentMatch(breed, answers);
    totalScore += temperamentScore.score * 0.15;
    maxScore += 5 * 0.15;
    factors.push(temperamentScore);
    
    // Normalize to 5-star scale
    const finalScore = (totalScore / maxScore) * 5;
    
    // Generate explanation and pros/cons
    const explanation = generateExplanation(breed, answers, factors);
    const pros = generatePros(breed, answers, factors);
    const cons = generateCons(breed, answers, factors);
    
    return {
        score: Math.round(finalScore * 10) / 10, // Round to 1 decimal place
        explanation,
        pros,
        cons
    };
}

function calculateSizeMatch(breed, answers) {
    const sizeCategory = breed.size_info.category;
    const housing = answers.housing || 'house';
    const garden = answers.garden || 'small';
    
    let score = 5;
    let reasoning = '';
    
    if (housing === 'apartment') {
        if (sizeCategory === 'Groß') {
            score = garden === 'large' ? 3 : 1;
            reasoning = garden === 'large' ? 'Große Hunde in Wohnungen brauchen viel Auslauf' : 'Große Hunde sind für kleine Wohnungen ungeeignet';
        } else if (sizeCategory === 'Mittel') {
            score = garden === 'none' ? 3 : 4;
            reasoning = garden === 'none' ? 'Mittelgroße Hunde brauchen regelmäßigen Auslauf' : 'Gut geeignet mit ausreichend Bewegung';
        } else {
            score = 5;
            reasoning = 'Kleine Hunde sind ideal für Wohnungen';
        }
    } else if (housing === 'house') {
        score = sizeCategory === 'Sehr klein' ? 4 : 5;
        reasoning = 'Gute Platzverhältnisse für diese Größe';
    } else { // farm
        score = 5;
        reasoning = 'Optimale Platzverhältnisse';
    }
    
    return { score, factor: 'Größe & Wohnsituation', reasoning };
}

function calculateActivityMatch(breed, answers) {
    const breedActivity = breed.activity_level; // 1-5 scale
    const userActivity = answers.activity || 'medium';
    const timeAvailable = answers.time || '3-4';
    
    let score = 5;
    let reasoning = '';
    
    // Map user activity to numeric scale
    const activityMap = { 'low': 1, 'medium': 3, 'high': 5 };
    const userActivityLevel = activityMap[userActivity];
    
    // Map time to numeric scale
    const timeMap = { '1-2': 1, '3-4': 3, '5+': 5 };
    const userTimeLevel = timeMap[timeAvailable];
    
    // Calculate activity match
    const activityDiff = Math.abs(breedActivity - userActivityLevel);
    const timeDiff = Math.abs(breedActivity - userTimeLevel);
    
    // Average the two factors
    const avgDiff = (activityDiff + timeDiff) / 2;
    
    if (avgDiff === 0) {
        score = 5;
        reasoning = 'Perfekte Übereinstimmung bei Aktivitätslevel';
    } else if (avgDiff <= 1) {
        score = 4;
        reasoning = 'Sehr gute Übereinstimmung bei Aktivitätslevel';
    } else if (avgDiff <= 2) {
        score = 3;
        reasoning = 'Moderate Anpassung beim Aktivitätslevel nötig';
    } else if (avgDiff <= 3) {
        score = 2;
        reasoning = 'Größere Anpassung beim Aktivitätslevel erforderlich';
    } else {
        score = 1;
        reasoning = 'Aktivitätslevel stimmt nicht überein';
    }
    
    return { score, factor: 'Aktivitätslevel', reasoning };
}

function calculateCareMatch(breed, answers) {
    const breedCareLevel = breed.care_level_numeric; // 1-3 scale
    const userExperience = answers.experience || 'some';
    const groomingTolerance = answers.grooming || 'moderate';
    
    let score = 5;
    let reasoning = '';
    
    // Map user experience to numeric scale (1-4)
    const experienceMap = { 'beginner': 1, 'some': 2, 'experienced': 3, 'expert': 4 };
    const userExpLevel = experienceMap[userExperience];
    
    // Map grooming tolerance to numeric scale
    const groomingMap = { 'minimal': 1, 'moderate': 2, 'high': 3 };
    const userGroomingLevel = groomingMap[groomingTolerance];
    
    // Check if user experience matches breed care requirements
    if (breedCareLevel === 3 && userExpLevel < 2) {
        score = 1;
        reasoning = 'Diese Rasse ist zu anspruchsvoll für Anfänger';
    } else if (breedCareLevel === 2 && userExpLevel >= 2) {
        score = 5;
        reasoning = 'Pflegeaufwand passt zu deiner Erfahrung';
    } else if (breedCareLevel === 1) {
        score = userExpLevel >= 1 ? 5 : 4;
        reasoning = 'Pflegeleichte Rasse, gut geeignet';
    } else {
        score = 3;
        reasoning = 'Machbar mit etwas Anpassung';
    }
    
    // Adjust for grooming tolerance
    if (breed.grooming_needs >= 4 && userGroomingLevel < 2) {
        score = Math.max(1, score - 1);
        reasoning += '. Beachte den hohen Pflegeaufwand für das Fell';
    }
    
    return { score, factor: 'Pflege & Erfahrung', reasoning };
}

function calculateFamilyMatch(breed, answers) {
    const children = answers.children || 'none';
    const pets = answers.pets || 'none';
    
    let score = 5;
    let reasoning = '';
    
    // Check compatibility with children
    if (children !== 'none') {
        const childScore = breed.good_with_children || 3;
        if (children === 'small' && childScore < 3) {
            score = Math.min(score, 2);
            reasoning = 'Nicht ideal für kleine Kinder';
        } else if (childScore >= 4) {
            reasoning = 'Sehr kinderfreundlich';
        } else if (childScore >= 3) {
            reasoning = 'Okay mit Kindern bei guter Sozialisierung';
        } else {
            score = Math.min(score, 2);
            reasoning = 'Nicht empfohlen für Familien mit Kindern';
        }
    }
    
    // Check compatibility with other pets
    if (pets !== 'none') {
        const petScore = breed.good_with_pets || 3;
        if (petScore < 3) {
            score = Math.min(score, score - 1);
            reasoning += '. Problematisch mit anderen Haustieren';
        } else if (petScore >= 4) {
            reasoning += '. Verträgt sich gut mit anderen Tieren';
        }
    }
    
    return { score, factor: 'Familientauglichkeit', reasoning };
}

function calculateTemperamentMatch(breed, answers) {
    const desiredTraits = answers.temperament || [];
    const dealbreakers = answers.dealbreakers || [];
    
    let score = 3; // Start with neutral
    let reasoning = 'Temperament-Bewertung basierend auf Präferenzen';
    let matches = 0;
    let conflicts = 0;
    
    // Check desired traits
    desiredTraits.forEach(trait => {
        switch(trait) {
            case 'friendly':
                if (breed.temperament.includes('Freundlich') || breed.family_friendly >= 4) {
                    matches++;
                }
                break;
            case 'protective':
                if (breed.temperament.includes('Wachsam') || breed.temperament.includes('Loyal')) {
                    matches++;
                }
                break;
            case 'calm':
                if (breed.temperament.includes('Ruhig') || breed.temperament.includes('Gelassen') || breed.activity_level <= 2) {
                    matches++;
                }
                break;
            case 'playful':
                if (breed.temperament.includes('Verspielt') || breed.activity_level >= 3) {
                    matches++;
                }
                break;
            case 'independent':
                if (breed.temperament.includes('Selbstständig') || breed.temperament.includes('Eigensinnig')) {
                    matches++;
                }
                break;
            case 'loyal':
                if (breed.temperament.includes('Loyal') || breed.temperament.includes('Anhänglich')) {
                    matches++;
                }
                break;
        }
    });
    
    // Check dealbreakers
    dealbreakers.forEach(dealbreaker => {
        switch(dealbreaker) {
            case 'aggressive':
                if (breed.temperament.includes('Wachsam') && breed.family_friendly < 3) {
                    conflicts++;
                }
                break;
            case 'loud':
                if (breed.noise_level >= 4) {
                    conflicts++;
                }
                break;
            case 'escape':
                if (breed.temperament.includes('Eigensinnig') || breed.activity_level >= 4) {
                    conflicts++;
                }
                break;
            case 'health':
                if (breed.health_issues) {
                    conflicts++;
                }
                break;
        }
    });
    
    // Calculate final score
    const matchRatio = desiredTraits.length > 0 ? matches / desiredTraits.length : 0.5;
    score = 3 + (matchRatio * 2); // 3-5 range based on matches
    score = Math.max(1, score - conflicts); // Reduce by conflicts
    
    return { score: Math.min(5, score), factor: 'Temperament', reasoning };
}

function generateExplanation(breed, answers, factors) {
    let explanation = `${breed.name} `;
    
    const avgScore = factors.reduce((sum, f) => sum + f.score, 0) / factors.length;
    
    if (avgScore >= 4.5) {
        explanation += 'ist eine ausgezeichnete Wahl für dich! ';
    } else if (avgScore >= 3.5) {
        explanation += 'ist eine gute Wahl für dich. ';
    } else if (avgScore >= 2.5) {
        explanation += 'könnte mit einigen Anpassungen funktionieren. ';
    } else {
        explanation += 'ist wahrscheinlich nicht die beste Wahl für deine Situation. ';
    }
    
    // Add specific reasoning from top factors
    const topFactor = factors.reduce((max, f) => f.score > max.score ? f : max);
    explanation += topFactor.reasoning;
    
    return explanation;
}

function generatePros(breed, answers, factors) {
    const pros = [];
    
    // Based on high-scoring factors
    factors.forEach(factor => {
        if (factor.score >= 4) {
            pros.push(factor.reasoning);
        }
    });
    
    // Add breed-specific pros
    if (breed.care_level_numeric === 1) {
        pros.push('Pflegeleicht und anfängerfreundlich');
    }
    
    if (breed.family_friendly >= 4) {
        pros.push('Sehr familienfreundlich');
    }
    
    if (breed.temperament.includes('Intelligent')) {
        pros.push('Intelligent und lernfähig');
    }
    
    if (breed.noise_level <= 2) {
        pros.push('Ruhig und wenig bellfreudig');
    }
    
    return pros.slice(0, 4); // Limit to 4 pros
}

function generateCons(breed, answers, factors) {
    const cons = [];
    
    // Based on low-scoring factors
    factors.forEach(factor => {
        if (factor.score <= 2) {
            cons.push(factor.reasoning);
        }
    });
    
    // Add breed-specific cons
    if (breed.health_issues) {
        cons.push('Neigt zu gesundheitlichen Problemen');
    }
    
    if (breed.care_level_numeric === 3 && answers.experience === 'beginner') {
        cons.push('Zu anspruchsvoll für Hundeanfänger');
    }
    
    if (breed.activity_level >= 4 && answers.activity === 'low') {
        cons.push('Benötigt viel mehr Bewegung als geplant');
    }
    
    if (breed.noise_level >= 4) {
        cons.push('Kann häufig bellen');
    }
    
    return cons.slice(0, 4); // Limit to 4 cons
}

function displayResults(matches) {
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = '';
    
    matches.forEach((match, index) => {
        const resultElement = createResultElement(match, index + 1);
        resultsContent.appendChild(resultElement);
    });
}

function createResultElement(match, rank) {
    const { breed, score, explanation, pros, cons } = match;
    
    const element = document.createElement('div');
    element.className = 'breed-result';
    
    const stars = generateStars(score);
    const prosHtml = pros.map(pro => `<li>${pro}</li>`).join('');
    const consHtml = cons.map(con => `<li>${con}</li>`).join('');
    
    const warningHtml = breed.health_issues ? `
        <div class="breed-warning">
            <h4>⚠️ Wichtiger Hinweis zu Gesundheitsproblemen</h4>
            <p>Diese Rasse kann unter bestimmten gesundheitlichen Problemen leiden. Bitte informiere dich ausführlich über mögliche Gesundheitsrisiken und wähle verantwortungsvolle Züchter.</p>
        </div>
    ` : '';
    
    element.innerHTML = `
        <div class="breed-result-header">
            <h3>#${rank} ${breed.name}</h3>
            <div class="compatibility-score">
                <div class="stars">${stars}</div>
                <span class="score-text">${score}/5</span>
            </div>
        </div>
        
        <div class="breed-info">
            <div class="breed-detail"><strong>Herkunft:</strong> ${breed.origin}</div>
            <div class="breed-detail"><strong>Größe:</strong> ${breed.size_info.min}-${breed.size_info.max} cm</div>
            <div class="breed-detail"><strong>Gewicht:</strong> ${breed.weight_info.min}-${breed.weight_info.max} kg</div>
            <div class="breed-detail"><strong>Lebenserwartung:</strong> ${breed.life_expectancy}</div>
            <div class="breed-detail"><strong>Pflegeaufwand:</strong> ${breed.care_level}</div>
            <div class="breed-detail"><strong>Kategorie:</strong> ${breed.category}</div>
        </div>
        
        <p>${breed.detailed_info}</p>
        
        <div class="match-explanation">
            <h4>Warum passt ${breed.name} zu dir?</h4>
            <p>${explanation}</p>
            
            <div class="pros-cons">
                <div class="pros">
                    <h5>✅ Vorteile für dich:</h5>
                    <ul>${prosHtml}</ul>
                </div>
                <div class="cons">
                    <h5>⚠️ Bedenkenswerte Punkte:</h5>
                    <ul>${consHtml}</ul>
                </div>
            </div>
        </div>
        
        ${warningHtml}
    `;
    
    return element;
}

function generateStars(score) {
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<span class="star">★</span>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHtml += '<span class="star">☆</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<span class="star star--empty">☆</span>';
    }
    
    return starsHtml;
}

function resetQuestionnaire() {
    currentStep = 1;
    answers = {};
    
    // Reset all form inputs
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    
    // Show questionnaire, hide results
    questionnaire.classList.remove('hidden');
    results.classList.add('hidden');
    
    // Reset step display
    updateStepDisplay();
}

function initializeComparison() {
    const breed1Select = document.getElementById('breed1-select');
    const breed2Select = document.getElementById('breed2-select');
    const compareBtn = document.getElementById('compare-btn');
    
    // Populate breed selectors
    dogBreeds.forEach(breed => {
        const option1 = new Option(breed.name, breed.id);
        const option2 = new Option(breed.name, breed.id);
        breed1Select.appendChild(option1);
        breed2Select.appendChild(option2);
    });
    
    compareBtn.addEventListener('click', compareBreeds);
}

function compareBreeds() {
    const breed1Id = parseInt(document.getElementById('breed1-select').value);
    const breed2Id = parseInt(document.getElementById('breed2-select').value);
    
    if (!breed1Id || !breed2Id) {
        alert('Bitte wähle zwei Rassen zum Vergleichen aus.');
        return;
    }
    
    if (breed1Id === breed2Id) {
        alert('Bitte wähle zwei verschiedene Rassen aus.');
        return;
    }
    
    const breed1 = dogBreeds.find(b => b.id === breed1Id);
    const breed2 = dogBreeds.find(b => b.id === breed2Id);
    
    displayComparison(breed1, breed2);
}

function displayComparison(breed1, breed2) {
    const comparisonResult = document.getElementById('comparison-result');
    
    const comparisonData = [
        ['Eigenschaft', breed1.name, breed2.name],
        ['Herkunft', breed1.origin, breed2.origin],
        ['Größe', `${breed1.size_info.min}-${breed1.size_info.max} cm`, `${breed2.size_info.min}-${breed2.size_info.max} cm`],
        ['Gewicht', `${breed1.weight_info.min}-${breed1.weight_info.max} kg`, `${breed2.weight_info.min}-${breed2.weight_info.max} kg`],
        ['Lebenserwartung', breed1.life_expectancy, breed2.life_expectancy],
        ['Pflegeaufwand', breed1.care_level, breed2.care_level],
        ['Aktivitätslevel', `${breed1.activity_level}/5`, `${breed2.activity_level}/5`],
        ['Familienfreundlichkeit', `${breed1.family_friendly}/5`, `${breed2.family_friendly}/5`],
        ['Wohnungseignung', `${breed1.apartment_suitable}/5`, `${breed2.apartment_suitable}/5`],
        ['Anfängerfreundlich', `${breed1.beginner_friendly}/5`, `${breed2.beginner_friendly}/5`],
        ['Temperament', breed1.temperament.join(', '), breed2.temperament.join(', ')],
        ['Kategorie', breed1.category, breed2.category]
    ];
    
    const tableHtml = `
        <div class="comparison-table">
            <table>
                ${comparisonData.map((row, index) => {
                    if (index === 0) {
                        return `<tr><th>${row[0]}</th><th class="breed-name">${row[1]}</th><th class="breed-name">${row[2]}</th></tr>`;
                    }
                    return `<tr><td><strong>${row[0]}</strong></td><td>${row[1]}</td><td>${row[2]}</td></tr>`;
                }).join('')}
            </table>
        </div>
    `;
    
    comparisonResult.innerHTML = tableHtml;
}

function initializeBrowse() {
    const sizeFilter = document.getElementById('size-filter');
    const careFilter = document.getElementById('care-filter');
    
    sizeFilter.addEventListener('change', filterBreeds);
    careFilter.addEventListener('change', filterBreeds);
    
    // Initial display
    displayAllBreeds();
}

function filterBreeds() {
    const sizeFilter = document.getElementById('size-filter').value;
    const careFilter = document.getElementById('care-filter').value;
    
    let filteredBreeds = dogBreeds;
    
    if (sizeFilter) {
        filteredBreeds = filteredBreeds.filter(breed => breed.size_info.category === sizeFilter);
    }
    
    if (careFilter) {
        filteredBreeds = filteredBreeds.filter(breed => breed.care_level === careFilter);
    }
    
    displayBreedGrid(filteredBreeds);
}

function displayAllBreeds() {
    displayBreedGrid(dogBreeds);
}

function displayBreedGrid(breeds) {
    const breedGrid = document.getElementById('breed-grid');
    breedGrid.innerHTML = '';
    
    breeds.forEach(breed => {
        const cardElement = createBreedCard(breed);
        breedGrid.appendChild(cardElement);
    });
}

function createBreedCard(breed) {
    const element = document.createElement('div');
    element.className = 'breed-card';
    
    const temperamentTags = breed.temperament.map(trait => 
        `<span class="temperament-tag">${trait}</span>`
    ).join('');
    
    element.innerHTML = `
        <h3>${breed.name}</h3>
        <p>${breed.description}</p>
        
        <div class="breed-basic-info">
            <span><strong>Größe:</strong> ${breed.size_info.category}</span>
            <span><strong>Pflege:</strong> ${breed.care_level}</span>
            <span><strong>Herkunft:</strong> ${breed.origin}</span>
            <span><strong>Lebenserwartung:</strong> ${breed.life_expectancy}</span>
        </div>
        
        <div class="temperament-tags">
            ${temperamentTags}
        </div>
    `;
    
    return element;
}

// Theme Management für die App
class ThemeManager {
    constructor() {
        this.currentTheme = 'auto';
        this.init();
    }

    init() {
        this.themeSelector = document.getElementById('theme-selector');
        this.setupEventListeners();
        this.loadSavedTheme();
    }

    setupEventListeners() {
        this.themeSelector?.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = ''; // Reset alle Klassen
        
        if (theme === 'auto') {
            // Verwende System-Präferenz
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        } else if (theme === 'light' || theme === 'dark') {
            document.body.classList.add(`theme-${theme}`);
        } else {
            // Spezielle Themes
            if (theme.startsWith('seasonal-')) {
                document.body.classList.add(`theme-${theme}`);
            } else {
                document.body.classList.add(`theme-${theme}`);
            }
        }
        
        // Theme speichern
        localStorage.setItem('selectedTheme', theme);
        
        // Selector aktualisieren
        if (this.themeSelector) {
            this.themeSelector.value = theme;
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('selectedTheme') || 'auto';
        this.setTheme(savedTheme);
    }
}

// Theme Manager initialisieren
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});