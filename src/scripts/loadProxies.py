with open('proxies.txt', 'r') as file:
    data = {}
    for line in file:
        row = line.strip()
        print("'" + row + "',")