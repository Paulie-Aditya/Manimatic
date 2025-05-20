from manim import *
import numpy as np

class Animation(Scene):
    def construct(self):
        # Constants for the logical values on the number line
        min_logical_val = 1 
        max_logical_val = 10

        # Constants for visual appearance of the number line
        num_line_vis_start = 0  # Start of the visible number line (pad left)
        num_line_vis_end = 11   # End of the visible number line (pad right)
        number_line_length = 12 # Visual length on screen

        # 1. Create the Number Line
        number_line = NumberLine(
            x_range=[num_line_vis_start, num_line_vis_end, 1], # Min, Max, Step
            length=number_line_length,
            color=BLUE, 
            include_numbers=True,
            label_direction=DOWN,
            font_size=36
        ).to_edge(DOWN, buff=1.8) # Position number line at the bottom with buffer
        self.add(number_line)

        # 2. Create the Ball (a Dot)
        ball_color = RED
        ball_initial_logical_pos = min_logical_val

        # ValueTracker for the ball's logical position (the number it represents)
        # This helps in smoothly updating the label text.
        ball_logical_value = ValueTracker(ball_initial_logical_pos)

        ball = Dot(
            point=number_line.n2p(ball_logical_value.get_value()), # n2p converts number to point
            color=ball_color,
            radius=0.15
        )

        # 3. Create a label for the ball that updates with its logical value
        # always_redraw ensures the label updates its text and position every frame.
        ball_label = always_redraw(
            lambda: MathTex(f"{int(np.round(ball_logical_value.get_value()))}", color=ball_color)
            .scale(0.7)
            .next_to(ball, UP, buff=0.25) # Position label above the ball
        )

        self.play(FadeIn(ball), FadeIn(ball_label))
        self.wait(0.5)

        # Title Mobject to display current hop size
        # Initialize it as an empty Text mobject; its content will be updated in the loop.
        current_title_mob = Text("", font_size=32).to_edge(UP, buff=0.5)
        self.add(current_title_mob)

        # Define a list of colors for the arcs, cycling through them
        arc_colors = [YELLOW_D, GREEN_D, ORANGE, PINK, PURPLE_A, TEAL_D]

        # Main loop: Iterate through hop increment sizes from 1 to max_logical_val
        for increment_size in range(1, max_logical_val + 1):
            # Update title text for the current increment size
            new_title_text_mob = Text(f"Hops of size: {increment_size}", font_size=32).to_edge(UP, buff=0.5)
            self.play(Transform(current_title_mob, new_title_text_mob), run_time=0.5)
            
            # Reset ball to logical start position (min_logical_val, e.g., 1) for each new increment_size
            current_logical_pos = min_logical_val
            ball_logical_value.set_value(current_logical_pos) # Update logical value first
            
            # Visually move ball to its starting screen position for this increment series
            target_ball_screen_pos = number_line.n2p(current_logical_pos)
            if increment_size > 1: # Animate reset for subsequent stages
                 self.play(ball.animate.move_to(target_ball_screen_pos), run_time=0.5)
            else: # For the first stage (increment_size=1), ball is already at start from FadeIn
                 ball.move_to(target_ball_screen_pos) # Instant placement

            self.wait(0.3) # Short pause before hops begin

            arcs_this_stage = VGroup() # Group to hold arcs for the current increment_size
            hop_arc_color = arc_colors[(increment_size - 1) % len(arc_colors)] # Cycle through arc_colors

            # Inner loop: Perform hops for the current increment_size
            while current_logical_pos < max_logical_val:
                target_logical_pos = current_logical_pos + increment_size

                # Ensure the hop does not overshoot max_logical_val
                if target_logical_pos > max_logical_val:
                    target_logical_pos = max_logical_val 

                # If no move is possible (e.g., already at max_logical_val and trying to hop further)
                if target_logical_pos == current_logical_pos: 
                    break

                start_point_coord = number_line.n2p(current_logical_pos)
                end_point_coord = number_line.n2p(target_logical_pos)
                
                # Create the arc path for the hop.
                # A positive angle for ArcBetweenPoints creates an arc "above" if moving L to R.
                hop_arc_path = ArcBetweenPoints(start_point_coord, end_point_coord, angle=PI/3.5, color=hop_arc_color)
                
                # Animate the creation of the arc ("line animation before it")
                self.play(Create(hop_arc_path), run_time=0.35)
                arcs_this_stage.add(hop_arc_path)

                # Animate the ball moving along the arc path
                # Simultaneously animate the ball's logical value for smooth label updates
                self.play(
                    MoveAlongPath(ball, hop_arc_path),
                    ball_logical_value.animate.set_value(target_logical_pos),
                    run_time=0.7
                )
                
                current_logical_pos = target_logical_pos # Update current logical position for next hop
                self.wait(0.05) # Very short pause after each hop

            # After all hops for the current increment_size are done
            if increment_size < max_logical_val: # For all but the last increment series
                self.wait(0.4)
                self.play(FadeOut(arcs_this_stage), run_time=0.4) # Fade out arcs of this stage
            else: # For the very last increment series (e.g., hops of size 10)
                self.wait(1.0) # Keep its arcs visible a bit longer

        self.wait(2) # Final pause at the end of the entire animation