import { server } from '../'

describe('Environment', () => {
  it('runs without crashing', () => {
    const instance = server.listen(8080, () => instance.close())
  })
})
