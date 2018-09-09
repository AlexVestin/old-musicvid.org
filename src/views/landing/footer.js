import React, { PureComponent } from 'react'
import classes from './footer.css'
export default class Footer extends PureComponent {

    render() {
        return(
            <footer className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.title}>musicvid.org </div>
                    <div className={classes.grid}>
                    
                        <a className={classes.link} href="/privacy">Privacy</a>
                        <a className={classes.link} href="/showcase">Showcase</a>
                        <a className={classes.link} href="/about">About</a>
                        <a className={classes.link} href="/editor">Editor</a>
                        <a className={classes.link} href="https://github.com/alexvestin/musicvid.org">Github</a>
                        <a className={classes.link} href="https://reddit.com">reddit</a>
                    </div>
                </div>
            </footer>
        )
    }
}