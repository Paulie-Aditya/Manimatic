from manim import *

class Animation(Scene):
    def construct(self):
        square = Square(side_length=2)
        circle = Circle(radius=1)
        rectangle = Rectangle(width=3, height=1)

        self.play(Create(square))
        self.wait(0.5)

        self.play(Transform(square, circle))
        self.wait(0.5)

        self.play(Transform(square, rectangle))
        self.wait(0.5)

        self.play(FadeOut(square))
        self.wait(0.5)
