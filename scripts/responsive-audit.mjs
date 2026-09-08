import fs from 'node:fs'
import path from 'node:path'

const roots = ['app','components']
const files=[]
function walk(dir){
  for(const name of fs.readdirSync(dir)){
    const p=path.join(dir,name); const st=fs.statSync(p)
    if(st.isDirectory()) walk(p)
    else if(/\.(tsx|ts|css)$/.test(name)) files.push(p)
  }
}
roots.forEach(r=>walk(r))

const risks=[]
for(const file of files){
  const text=fs.readFileSync(file,'utf8')
  const lines=text.split('\n')
  lines.forEach((line,i)=>{
    if(/className=.*\bmin-w-\[[^\]]+\]/.test(line) && !/(sm:|md:|lg:|xl:)min-w-/.test(line)) risks.push(`${file}:${i+1} fixed min-width without breakpoint`)
    if(/className=.*\bgrid-cols-[5-9]\b/.test(line) && !/(sm:|md:|lg:|xl:)grid-cols-[5-9]/.test(line)) risks.push(`${file}:${i+1} dense mobile grid`)
    if(/className=.*\btext-(6xl|7xl|8xl|9xl)\b/.test(line) && !/(sm:|md:|lg:|xl:)text-(6xl|7xl|8xl|9xl)/.test(line)) risks.push(`${file}:${i+1} very large default text`)
    if(/<table\b/.test(line) && !/overflow-x-auto/.test(text.slice(Math.max(0,text.indexOf(line)-500), text.indexOf(line)+500))) risks.push(`${file}:${i+1} table without nearby horizontal scroll wrapper`)
  })
}

console.log(`Responsive audit scanned ${files.length} source files.`)
if(risks.length){
  console.log('Potential responsive risks:')
  risks.forEach(r=>console.log(`- ${r}`))
  process.exitCode=1
} else {
  console.log('Responsive audit PASS: no obvious desktop-only width/grid/text/table risks found.')
}
