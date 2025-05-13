import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: 'https://advanced-bedbug-34697.upstash.io',
    token: 'AYeJAAIjcDFjZDQyMDM2N2MwMGY0ZjE0YWY0MzQ5NmEzOTU2MjhhMnAxMA',
})

export default redis;