import random

def random_quick_sort(arr):
    if len(arr) <= 1:
        return arr[:]

    pivot = random.choice(arr)
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return random_quick_sort(left) + middle + random_quick_sort(right)
