<?php

namespace App\Controller;

use App\Entity\RepLog;
use App\Repository\RepLogRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * Class LiftController
 */
class LiftController extends BaseController
{
    /**
     * @Route(
     *     "/lift",
     *     name="lift"
     * )
     *
     * @param RepLogRepository    $replogRepo
     * @param UserRepository      $userRepo
     * @param TranslatorInterface $translator
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|Response
     */
    public function indexAction(
        RepLogRepository $replogRepo,
        UserRepository $userRepo,
        TranslatorInterface $translator
    ) {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        $repLogAppProps = [
            'withHeart' => true,
            'itemOptions' => [],
        ];
        foreach (RepLog::getThingsYouCanLiftChoices() as $label => $id) {
            $repLogAppProps['itemOptions'][] = [
                'id' => $id,
                'text' => $translator->trans($label),
            ];
        }

        return $this->render('lift/index.html.twig', array(
            'leaderboard' => $this->getLeaders($replogRepo, $userRepo),
            'repLogAppProps' => $repLogAppProps,
        ));
    }

    /**
     * Returns an array of leader information
     *
     * @param RepLogRepository $replogRepo
     * @param UserRepository   $userRepo
     *
     * @return array
     */
    private function getLeaders(
        RepLogRepository $replogRepo,
        UserRepository $userRepo
    ) {
        $leaderboardDetails = $replogRepo->getLeaderboardDetails();

        $leaderboard = array();
        foreach ($leaderboardDetails as $details) {
            if (!$user = $userRepo->find($details['user_id'])) {
                // interesting, this user is missing...
                continue;
            }

            $leaderboard[] = array(
                'username' => $user->getUsername(),
                'weight' => $details['weightSum'],
                'in_cats' => number_format(
                    $details['weightSum']/RepLog::WEIGHT_FAT_CAT
                ),
            );
        }

        return $leaderboard;
    }
}
