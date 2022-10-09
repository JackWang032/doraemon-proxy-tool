let err = false

const FORCE_YARN_INSTALL = true

console.log('pre install') 

if (FORCE_YARN_INSTALL) {
    if (!/yarn/.test(process.env.npm_config_user_agent)) {
        console.error('\033[1;31m*** Please use yarn to install dependencies.\033[0;0m')
        err = true
    }
}

if (err) {
    console.error('')
    process.exit(1)
}
