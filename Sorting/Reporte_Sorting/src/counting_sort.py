def counting_sort(arr):
    if not arr:
        return

    max_val = max(arr)
    count = [0] * (max_val + 1)

    for num in arr:
        count[num] += 1

    index = 0
    for value, freq in enumerate(count):
        for _ in range(freq):
            arr[index] = value
            index += 1
