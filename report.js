const reporter = require("cucumber-html-reporter")
const options ={
     theme:'bootstrap',
     jsonFile:'cucumber-report.json',
     output:'cucumber-html-result.html',
     reportSuiteAsScenaros:true,
     launchReport:false,
}
reporter.generate(options)