#!/bin/bash
cd /home/kavia/workspace/code-generation/animalsketchquest-107200-0702fcbd/drawing_game_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

