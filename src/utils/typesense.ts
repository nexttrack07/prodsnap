import Typesense from 'typesense';

export const typesense = new Typesense.Client({
  'nodes': [{
    'host': '1cifn3z905l76jqxp-1.a1.typesense.net', // where xxx is the ClusterID of your Typesense Cloud cluster
    'port': 443,
    'protocol': 'https'
  }],
  'apiKey': import.meta.env.VITE_TYPESENSE_API_KEY,
  'connectionTimeoutSeconds': 2
})