import { Button } from '../ui/button';
import { Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const Emoji = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl text-white
      bg-linear-to-bl from-white/15 to-white/1  backdrop-blur-xl
      "
          title="Coming soon"
        >
          <Smile className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-full bg-linear-to-bl from-slate-900 to-slate-800">
        <div className=" flex gap-3 ">
          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Clapping%20Hands%20Medium%20Skin%20Tone.png"
            alt="Clapping Hands Medium-Dark Skin Tone"
            width="25"
            height="25"
          />

          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Raising%20Hands%20Medium%20Skin%20Tone.png"
            alt="Raising Hands Medium-Dark Skin Tone"
            width="25"
            height="25"
          />

          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Thumbs%20Up%20Medium%20Skin%20Tone.png"
            alt="Thumbs Up Medium Skin Tone"
            width="25"
            height="25"
          />

          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Party%20Popper.png"
            alt="Party Popper"
            width="25"
            height="25"
          />

          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Hugging%20Face.png"
            alt="Hugging Face"
            width="25"
            height="25"
          />
          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Fire.png"
            alt="Fire"
            width="25"
            height="25"
          />
          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Red%20Heart.png"
            alt="Red Heart"
            width="25"
            height="25"
          />

          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Thinking%20Face.png"
            alt="Thinking Face"
            width="25"
            height="25"
          />
          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Face%20with%20Tears%20of%20Joy.png"
            alt="Face with Tears of Joy"
            width="25"
            height="25"
          />

          <img
            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Crying%20Face.png"
            alt="Crying Face"
            width="25"
            height="25"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Emoji;
