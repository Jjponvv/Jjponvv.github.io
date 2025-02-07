import datetime, requests


now = datetime.datetime.now()
month = now - datetime.timedelta(days=31)
time = f'net__gte={month.isoformat()}&net__lte={now.isoformat()}'

mode = 'mode=list'
format = 'format=json'
ordering = 'ordering=net'

query_url = base_url + '?' + '&'.join((time, mode, ordering, format))



print('query_url =', query_url)

def get_results(query_url: str) -> dict or None:
    try:
        results = requests.get(query_url)
    except Exception as e:
        print(f'Exception {e}')
    else:
        
        status = results.status_code
        print(f'status: {status}')

        if status != 200:
            return
        
        return results.json()

results = get_results(query_url)

if not results:
    quit()

print(results)

next_url = results['next']
while next_url:

    next_results = get_results(next_url)

    if not results:
        quit()

    print(next_results)

    results['results'] += next_results['results']

    next_url =next_results['next']

print('\n\n\n\n\n\n\n\n\n\n\n\n\n')
print(results['results'][-1]['name'] + " - "+ results['results'][-1]['lsp_name'])
