
# Pin is validated by
# deviding the number into two parts
# and summing them up and check
# if square of sum is equal to original number

# We can brute-force the square root
# and check if the square can be devided two segment
# with such property and condition present
# in the executable

def isPrime(num: int) -> bool:
    if num == 1: return False
    if num == 2: return True
    if num % 2 == 0: return False

    i = 3

    while i * i <= num:
        if num % i == 0: return False
        
        i += 2

    return True

def check(num: int) -> bool:
    square = num * num

    left = square
    right = 0
    power = 1

    while left > 0:
        right = power * (left % 10) + right
        left //= 10
        power *= 10

        total = left + right

        if left > right and total == num and isPrime(right):
            return True
    
    return False

for i in range(0x5000, 1_000_000):
    if check(i):
        print(i, i * i)
