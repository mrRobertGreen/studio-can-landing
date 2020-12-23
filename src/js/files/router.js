class Router {
    routes = []
    mode = null
    root = "/"

    constructor(options) {
        this.mode = window.history.pushState ? 'history' : 'hash'
        if (options.mode) this.mode = options.mode
        if (options.root) this.mode = options.root

        this.listen()
    }

    add = (path, cb) => { // добавление нового пути 
        this.routes.push({
            path,
            cb
        })
        return this
    }

    remove = (path) => { // удаление пути
        this.routes.filter(r => r.path !== path)
        return path
    }

    flush = () => { // очистка всех путей
        this.routes = []
        return this
    }

    clearSlashes = (path) => // удаление всех маршрутизаторов ?
        path
        .toString()
        .replace(/\/$/, '')
        .replace(/^\//, '')

    getFragment = () => {
        let fragment = ""

        if (this.mode === "history") {
            fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search))
            fragment = fragment.replace(/\?(.*)$/, '')
            fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment
        } else {
            const match = window.location.href.match(/#(.*)$/)
            fragment = match ? match[1] : ''
        }
        return this.clearSlashes(fragment)
    }

    navigate = (path = '') => {
        if (this.mode === 'history') {
            window.history.pushState(null, null, this.root + this.clearSlashes(path))
        } else {
            window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`
        }
        return this
    }

    listen = () => {
        clearInterval(this.interval)
        this.interval = setInterval(this.interval, 50)
    }
    interval = () => {
        if (this.current === this.getFragment()) return
        this.current = this.getFragment()

        this.routes.some(route => {
            const match = this.current.match(route.path)

            if (match) {
                match.shift()
                route.cb.apply({}, match)
                return match
            }
            return false
        })
    }
}