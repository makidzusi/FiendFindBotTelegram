import { Client } from '@elastic/elasticsearch'
export default new Client({
    node: 'http://127.0.0.1:9200',
})
