/**
 * CHANGE MODICON CONCEPT DFB PASSWORD
 * Mengganti password DFB pada project concept.
 * Password baru adalah 000000
 */

const fs = require('fs')
const { join, basename, extname } = require('path')

console.log('Running script to modify DFBs password...')

const cwd = join(process.cwd(), 'DFB')

if (!fs.existsSync(cwd)) {
  console.log('ERROR: DFB not found!')
  console.log(
    'Please copy DFB folder from your concept project to ' + process.cwd()
  )
  process.exit()
}

const resultDirectory = join(cwd, 'DFB_000000_' + new Date().getTime())

const files = fs.readdirSync(cwd)

if (!fs.existsSync(resultDirectory)) {
  fs.mkdirSync(resultDirectory)
}

files.forEach(file => {
  const filePath = join(cwd, file)
  const stat = fs.statSync(filePath)
  if (stat.isDirectory()) {
    return
  }
  const dfbName = basename(file, extname(file))
  try {
    const buffer = fs.readFileSync(filePath)

    if (extname(file).toLowerCase() === '.p4') {
      const locked =
        buffer
          .slice(2481, 2484)
          .toString('hex')
          .toUpperCase() === 'FFFFFF'
      if (locked) {
        console.log('Modify password ', dfbName, 'to 000000')
        buffer.write('E6054639', 2485, 'hex')
      }
    }

    const newFilePath = join(resultDirectory, file)
    try {
      fs.writeFileSync(newFilePath, buffer, 'binary')
    } catch {
      console.log(`Error when modify dfb "${dfbName}"`)
    }
  } catch {
    console.log(`Error when read dfb "${dfbName}"`)
  }
})

console.log('______________________________________________________________')
console.log('Enjoy, new password for locked DFB is "000000" (without quotes).')
console.log(`Modified DFBs has been saved to ${resultDirectory}.`)
