from manim import *

class Animation(Scene):
    def construct(self):
        # --- Define Colors ---
        owl_color = BLUE_E
        text_color = WHITE

        # --- Define Shapes ---
        body = Ellipse(width=3, height=4, color=owl_color, fill_opacity=1)
        head = Circle(radius=1.5, color=owl_color, fill_opacity=1).shift(UP * 2)
        left_eye = Circle(radius=0.4, color=text_color, fill_opacity=1).shift(UP * 2.5 + LEFT * 0.6)
        right_eye = Circle(radius=0.4, color=text_color, fill_opacity=1).shift(UP * 2.5 + RIGHT * 0.6)
        left_pupil = Circle(radius=0.2, color=BLACK, fill_opacity=1).shift(UP * 2.5 + LEFT * 0.6)
        right_pupil = Circle(radius=0.2, color=BLACK, fill_opacity=1).shift(UP * 2.5 + RIGHT * 0.6)
        beak = Triangle(color=YELLOW, fill_opacity=1).scale(0.3).rotate(PI).shift(UP * 1.8)
        left_wing = RoundedRectangle(width=1.5, height=2, corner_radius=0.5, color=owl_color, fill_opacity=1).shift(LEFT * 2 + DOWN * 0.5).rotate(0.3)
        right_wing = RoundedRectangle(width=1.5, height=2, corner_radius=0.5, color=owl_color, fill_opacity=1).shift(RIGHT * 2 + DOWN * 0.5).rotate(-0.3)
        left_ear = Triangle(color=owl_color, fill_opacity=1).scale(0.3).rotate(PI/6).shift(UP*3+LEFT*0.8)
        right_ear = Triangle(color=owl_color, fill_opacity=1).scale(0.3).rotate(-PI/6).shift(UP*3+RIGHT*0.8)


        # --- Create Text ---
        gm_text = Text("GM", color=text_color).scale(0.8).move_to(body.get_center() + LEFT * 0.8)
        chat_text = Text("Chat", color=text_color).scale(0.8).move_to(body.get_center() + RIGHT * 0.8)

        # --- Group Owl ---
        owl = VGroup(body, head, left_eye, right_eye, left_pupil, right_pupil, beak, left_wing, right_wing, gm_text, chat_text, left_ear, right_ear)


        # --- Animation ---
        self.play(
            Create(body), run_time=1
        )
        self.play(
            Create(head), run_time=1
        )
        self.play(
            Create(left_eye), Create(right_eye), run_time=1
        )
        self.play(
            Create(left_pupil), Create(right_pupil), run_time=1
        )
        self.play(
            Create(beak), run_time=1
        )
        self.play(
            Create(left_wing), Create(right_wing), run_time=1
        )
        self.play(
            Write(gm_text), Write(chat_text), run_time=1
        )

        self.play(Create(left_ear), Create(right_ear))

        self.wait(2)
        self.play(owl.animate.scale(0.8).shift(DOWN * 0.5))
        self.wait(1)

        final_text = Text("GM Chat!", color=BLUE).scale(1.2).to_edge(UP)
        self.play(Transform(VGroup(gm_text, chat_text), final_text))
        self.wait(3)
