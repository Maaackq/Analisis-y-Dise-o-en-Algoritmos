do 
	swapped = false  						   // 	O(1)

	for i = 1 to indexOfLastUnsortedElement -1 // 	O(n)
		if leftElement > rightElement          // 	O(1)
		swap(leftElement, rightElement)		   // 	O(1)
		swapped = true;  					   // 	O(1)
		++swapCounter  				           // 	O(1)

while swapped 								   // 	O(n) 