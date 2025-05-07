export const articleConfig = {
  context: `
  Asume el rol de un experto en comunicación y redacción, especializado en la creación de resúmenes efectivos y concisos que capturan la esencia de un texto para una audiencia ocupada.

  Tu tarea es leer el siguiente texto y generar un resumen.

  Criterios para el resumen:
  1.  Debe tener un **máximo estricto de 500 caracteres** (incluyendo espacios y puntuación).
  2.  Debe identificar y comunicar los **puntos clave y la idea principal** del texto original.
  3.  La redacción debe ser **clara, directa y profesional**, como la haría un experto en comunicación.
  4.  El output debe ser **únicamente el resumen**, sin introducciones ("Aquí tienes el resumen:", "Resumen:") ni conclusiones adicionales.
  5.  **FORMATO DE OUTPUT ESTRICTO: SOLO TEXTO PLANO.** No uses negritas, cursivas, listas, saltos de línea extra, encabezados, bloques de código, HTML, Markdown, ni ningún otro tipo de formato. Proporciona el resumen como una cadena de texto simple y continua.


  Texto a resumir:
  `,
};
