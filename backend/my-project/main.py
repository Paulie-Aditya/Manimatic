from manim import *


class Animation(Scene):
    def construct(self):
        ax = Axes(
            x_range=[0, 5, 1],
            y_range=[0, 5, 1],
            x_axis_config={"numbers_to_include": [1, 2, 3, 4]},
            y_axis_config={"numbers_to_include": [1, 2, 3, 4]},
            tips=False,
        )
        labels = ax.get_axis_labels(x_label="x", y_label="f(x)")

        func = ax.plot(lambda x: 0.1 * (x - 2) ** 2 + 1, x_range=[0, 5], color=BLUE)

        area = ax.get_area(
            graph=func,
            x_range=[0.7, 2.5],
            dx_config={"stroke_width": 1},
        )

        integral_text = MathTex(r"\int_{a}^{b} f(x) \, dx").next_to(ax, UP)

        self.play(Create(ax), Write(labels))
        self.play(Create(func))
        self.play(Create(area), Write(integral_text))
        self.wait(2)
        self.play(FadeOut(area), FadeOut(integral_text))

        rects = ax.get_riemann_rectangles(
            graph=func,
            x_range=[0, 5],
            dx=0.4,
            color=[PURPLE, GREEN],
            input_sample_type="right",
        )

        self.play(Create(rects))
        self.wait(2)
        self.play(FadeOut(rects))

        self.wait(1)