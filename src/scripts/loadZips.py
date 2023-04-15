with open('zipcodes.txt', 'r') as file:
    data = {}
    for line in file:
        row = line.strip().split(" 	")
        if (len(row) < 2):
            continue
        if row[1] not in data:
            data[row[1]] = []
        data[row[1]].append(row[0])
    for city in sorted(data.keys()):
        print("'" + city + "'" + ": [" + ", ".join(sorted(data[city])) + "],")