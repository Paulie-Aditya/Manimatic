from manim import *

class Animation(Scene):
    def construct(self):
        # Define colors
        body_color = BLUE_E
        face_color = WHITE
        eye_color = BLACK
        beak_color = ORANGE
        wing_color = BLUE_D

        # Create the body
        body = Ellipse(width=3, height=5, color=body_color, fill_opacity=1)

        # Create the face
        face = Circle(radius=1.7, color=face_color, fill_opacity=1)
        face.move_to(body.get_center() + UP * 0.7)

        # Create the eyes
        left_eye = Circle(radius=0.4, color=eye_color, fill_opacity=1)
        right_eye = left_eye.copy()
        left_eye.move_to(face.get_center() + LEFT * 0.6 + UP * 0.2)
        right_eye.move_to(face.get_center() + RIGHT * 0.6 + UP * 0.2)

        # Create the beak
        beak = Triangle(color=beak_color, fill_opacity=1).scale(0.4)
        beak.rotate(PI)  # Point beak downwards
        beak.move_to(face.get_center() + DOWN * 0.4)

        # Create the wings
        left_wing = Polygon(
            [-1, 0, 0], [-2, -2, 0], [-3, 0, 0], [-2, 2, 0], color=wing_color, fill_opacity=1
        )
        right_wing = left_wing.copy().rotate(PI)
        left_wing.move_to(body.get_center() + LEFT * 1.5 + DOWN * 0.5)
        right_wing.move_to(body.get_center() + RIGHT * 1.5 + DOWN * 0.5)

        # Create ear tufts
        left_ear = Triangle(color=body_color, fill_opacity=1).scale(0.3).rotate(PI/2)
        right_ear = left_ear.copy().rotate(PI)
        left_ear.move_to(face.get_center() + UP*1.8 + LEFT*0.7)
        right_ear.move_to(face.get_center() + UP*1.8 + RIGHT*0.7)

        # Group all parts together
        owl = VGroup(body, face, left_eye, right_eye, beak, left_wing, right_wing, left_ear, right_ear)


        # Animation sequence
        self.play(
            Create(body),
            run_time=1
        )
        self.play(
            Create(face),
            run_time=0.5
        )
        self.play(
            Create(left_eye),
            Create(right_eye),
            run_time=0.5
        )
        self.play(
            Create(beak),
            run_time=0.5
        )
        self.play(
            Create(left_wing),
            Create(right_wing),
            run_time=0.5
        )

        self.play(
            Create(left_ear),
            Create(right_ear),
            run_time=0.5
        )


        self.wait(2)
        self.play(owl.animate.shift(LEFT * 2))
        self.wait(1)
