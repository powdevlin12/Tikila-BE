import minimist from 'minimist'

const option = minimist(process.argv)

console.dir({ option: option.env === 'production' })

export const isProduction = option.production === true || option.env === 'production'
