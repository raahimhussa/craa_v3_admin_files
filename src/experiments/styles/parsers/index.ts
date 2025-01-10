export default {}
// export function parseValues<O = any>(
//   object: O,
//   ...properties: string[]
// ): { [K in keyof O]: { [key: string]: string } } {
//   let temporary = {} as any
//   for (const [key, value] of Object.entries(object)) {
//     if (key in object) {
//       temporary[key] = properties.reduce((prev, cur) => {
//         return {
//           ...prev,
//           [cur]: value?.computedValue,
//         }
//       }, {})
//     }
//   }
//   return temporary
// }

// type Negative<T> = {
//   // @ts-ignore
//   [K in keyof T as Exclude<`-${K}`, '-0'>]: any
// }

// export const negativate = <T = any>(value: T): Negative<T> => {
//   let result: any = {}
//   Object.entries(value).forEach((entry) => {
//     if (entry[0] === '0') {
//       return
//     }
//     result['-' + entry[0]] = Object.entries(entry[1]).reduce((prev, cur) => {
//       return { ...prev, [cur[0]]: `calc(${cur[1]} * -1)` }
//     }, {})
//   })
//   return result
// }

// export const getRatios = (ratio: string | number) => {
//   if (typeof ratio === 'string') {
//     const ratios = ratio.trim().split(/\/|:|x/)
//     if (ratios.length === 1) ratios[1] = ratios[0]
//     return ratios
//   }
//   return [ratio, 1]
// }

// // ratio: (value: string | number) => {
// //   const r = getRatios(value)
// //   return {
// //     '--aspect-w': r[0],
// //     '--aspect-h': r[1],
// //     position: 'relative',
// //     aspectRatio: 'var(--aspect-w, 1) / var(--aspect-h, 1)',
// //     '& > *': {
// //       width: '100%',
// //       height: '100%',
// //     },
// //   }
// // },
