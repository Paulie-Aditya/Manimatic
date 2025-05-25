from manim import *

class Animation(Scene):
    def construct(self):
        # Define the numbers to be sorted
        numbers = [5, 2, 8, 1, 9, 4, 7, 3, 6]
        n = len(numbers)

        # Create Text objects for each number
        number_texts = [Text(str(num)) for num in numbers]

        # Arrange the numbers horizontally
        group = VGroup(*number_texts).arrange(RIGHT)
        self.play(Create(group))
        self.wait(0.5)

        # Bubble Sort Algorithm Animation
        for i in range(n):
            for j in range(0, n - i - 1):
                # Highlight the numbers being compared
                self.play(group[j].animate.set_color(RED), group[j+1].animate.set_color(RED))
                self.wait(0.5)

                # Compare the numbers
                if numbers[j] > numbers[j+1]:
                    # Swap the numbers in the animation and the list
                    numbers[j], numbers[j+1] = numbers[j+1], numbers[j]
                    self.play(
                        group[j].animate.shift(RIGHT),
                        group[j+1].animate.shift(LEFT)
                    )
                    number_texts[j], number_texts[j+1] = number_texts[j+1], number_texts[j]
                    group.submobjects = number_texts  # Update the group's submobjects to reflect the swap
                    self.wait(0.5)

                # Reset the color of the numbers
                self.play(group[j].animate.set_color(WHITE), group[j+1].animate.set_color(WHITE))
                self.wait(0.2)

            # The last element in each pass is sorted, so color it green
            self.play(group[n - i - 1].animate.set_color(GREEN))
            self.wait(0.2)

        # Last element to green
        self.play(group[0].animate.set_color(GREEN))

        # Show the sorted list
        self.wait(1)